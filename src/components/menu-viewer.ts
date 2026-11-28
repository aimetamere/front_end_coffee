import { getDocument, GlobalWorkerOptions, type PDFPageProxy, type RenderTask } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import './menu-viewer.css';
import { fadeOutLoader, loaderHeld, loaderMarkup } from './loader';
import { holdPageVeil, isPageVeiled } from './page-transition';
import { escapeHtml } from '../api';
import { MENU } from './cafe-info';

GlobalWorkerOptions.workerSrc = workerUrl;

/** Sharper canvases on high-density screens, capped to keep phone memory in check. */
const MAX_PIXEL_RATIO = 3;

const downloadIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>`;

/** The menu page: a title, the download button, then every PDF page stacked in order.
 *  On phones the button sits under the pages instead (CSS shows one of the two). */
export function createMenuPage(): HTMLElement {
  const main = document.createElement('div');
  main.className = 'menu-page';
  main.innerHTML = `
    <div class="menu-page__head section-heading">
      <img class="section-heading__oval" src="/shapes/Shape2.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <div class="menu-page__title-row">
        <h1 class="menu-page__title">Le menu</h1>
      </div>
      <p class="section-subtitle">${escapeHtml(MENU.subtitle)}</p>
    </div>
    <div class="menu-page__bar">
      <a class="menu-download" href="${escapeHtml(MENU.pdf)}" download>
        <span class="menu-download__text">Télécharger</span>
        <span class="menu-download__icon">${downloadIcon}</span>
      </a>
    </div>
    <div class="menu-pdf" aria-label="Pages du menu">
      <div class="menu-pdf__status loader-host">${loaderMarkup('Chargement du menu')}</div>
    </div>
    <div class="menu-page__foot">
      <a class="menu-download" href="${escapeHtml(MENU.pdf)}" download>
        <span class="menu-download__text">Télécharger</span>
        <span class="menu-download__icon">${downloadIcon}</span>
      </a>
    </div>
  `;

  mountPdf(main.querySelector<HTMLElement>('.menu-pdf')!);
  return main;
}

type Sheet = {
  page: PDFPageProxy;
  frame: HTMLElement;
  canvas: HTMLCanvasElement;
  task: RenderTask | null;
  /** Width (CSS px × pixel ratio) the canvas was last painted at; 0 = not painted yet. */
  paintedAt: number;
  visible: boolean;
};

async function mountPdf(container: HTMLElement) {
  const status = container.querySelector<HTMLElement>('.menu-pdf__status')!;
  const shownAt = performance.now();
  // Opened under the page veil: the veil's loader covers this one, so no extra hold, and
  // the veil stays until the first page has painted.
  const veiled = isPageVeiled();
  let firstPainted: () => void = () => {};
  holdPageVeil(new Promise<void>((resolve) => (firstPainted = resolve)));

  let sheets: Sheet[];
  try {
    const pdf = await getDocument(MENU.pdf).promise;
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)),
    );
    sheets = pages.map((page, i) => {
      const { width, height } = page.getViewport({ scale: 1 });
      const frame = document.createElement('div');
      frame.className = 'menu-pdf__page';
      // The page's own proportions (A4), so the column never jumps while pages paint.
      frame.style.aspectRatio = `${width} / ${height}`;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', `Menu, page ${i + 1} sur ${pages.length}`);
      frame.append(canvas);
      return { page, frame, canvas, task: null, paintedAt: 0, visible: false };
    });
  } catch {
    firstPainted();
    if (!veiled) await loaderHeld(shownAt);
    status.classList.remove('loader-host');
    status.setAttribute('role', 'status');
    status.innerHTML = `Le menu n’a pas pu s’afficher. <a href="${escapeHtml(MENU.pdf)}" download>Télécharger le PDF</a>`;
    return;
  }

  // The loader plays its minimum time, fades, then the pages take its place.
  if (!veiled) {
    await loaderHeld(shownAt);
    await fadeOutLoader(status);
  }
  status.remove();
  container.append(...sheets.map((sheet) => sheet.frame));
  // The pages just took their full height: a link to a section further down
  // (/menu.html#contact) lands there again.
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

  const paint = (sheet: Sheet) => {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    const target = Math.round(sheet.frame.clientWidth * ratio);
    if (!target || target === sheet.paintedAt) return;

    sheet.task?.cancel();
    const base = sheet.page.getViewport({ scale: 1 });
    const viewport = sheet.page.getViewport({ scale: target / base.width });

    // Paint off screen, then swap in, so a resize never flashes a blank page.
    const next = document.createElement('canvas');
    next.width = Math.floor(viewport.width);
    next.height = Math.floor(viewport.height);
    const context = next.getContext('2d');
    if (!context) return;

    const task = sheet.page.render({ canvasContext: context, viewport });
    sheet.task = task;
    task.promise
      .then(() => {
        sheet.canvas.width = next.width;
        sheet.canvas.height = next.height;
        sheet.canvas.getContext('2d')?.drawImage(next, 0, 0);
        sheet.paintedAt = target;
        sheet.frame.classList.add('is-painted');
        firstPainted();
      })
      .catch(() => {
        // Cancelled by a newer paint of the same page.
      })
      .finally(() => {
        if (sheet.task === task) sheet.task = null;
      });
  };

  // Pages paint as they come near the screen, one screen ahead.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const sheet = sheets.find((s) => s.frame === entry.target);
        if (!sheet) continue;
        sheet.visible = entry.isIntersecting;
        if (sheet.visible) paint(sheet);
      }
    },
    { rootMargin: '100% 0px' },
  );
  sheets.forEach((sheet) => observer.observe(sheet.frame));

  // A wider or narrower column repaints the pages on screen; the rest repaint when reached.
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      sheets.forEach((sheet) => {
        if (sheet.visible) paint(sheet);
      });
    }, 150);
  });
}
