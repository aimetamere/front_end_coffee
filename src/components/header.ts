import './header.css';
import { capAccent } from '../style/cap-accent';
import { CAFE, HOURS, NAV_LINKS as links } from './cafe-info';
import { escapeHtml } from '../api';
import { tintBrowserBar } from './theme-color';
import { contactIcons } from './contact-icons';
import { mountPageTransition } from './page-transition';

/** Moves on even if a menu animation never reports finishing (e.g. background tabs). */
const ANIMATION_FALLBACK_MS = 900;
const mobileQuery = window.matchMedia('(max-width: 768px)');

const burger = `
  <span class="burger" aria-hidden="true">
    <span class="burger__bar burger__bar--top"></span>
    <span class="burger__bar burger__bar--middle"></span>
    <span class="burger__bar burger__bar--bottom"></span>
  </span>`;

/** Arrow after each menu link, so they read as places to go. */
const linkArrow = `
  <svg class="bubble-menu__arrow" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>`;

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <svg class="site-header__lip" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M-2000 -100H140V64H48A20 20 0 0 1 28 44V22A16 16 0 0 0 12 6H-2000Z" />
    </svg>
    <a class="site-header__logo" href="/" aria-label="Café du Conservatoire, accueil">
      <span class="site-header__logo-text">Café du Conservatoire</span>
      <span class="site-header__logo-mark" aria-hidden="true">
        <img src="/Logo%20conservatoire/logo1_normal.png" alt="" width="1475" height="1820" />
      </span>
    </a>
    <button
      type="button"
      class="menu-bubble"
      aria-haspopup="dialog"
      aria-controls="bubble-menu"
      aria-expanded="false"
      aria-label="Ouvrir le menu"
    >
      ${burger}
    </button>

    <dialog id="bubble-menu" class="bubble-menu" aria-label="Menu">
      <img class="bubble-menu__shape bubble-menu__shape--circle" src="/shapes/Shape3.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <img class="bubble-menu__shape bubble-menu__shape--arch" src="/shapes/Shape6.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <span class="bubble-menu__sphere" aria-hidden="true">
        <img class="bubble-menu__mark" src="/Logo%20conservatoire/logo1_normal.png" alt="" width="1475" height="1820" />
      </span>
      <img class="bubble-menu__wordmark" src="/Logo%20conservatoire/logo1_normal.png" alt="" aria-hidden="true" width="1475" height="1820" />
      <button type="button" class="bubble-menu__close" aria-label="Fermer le menu">${burger}</button>
      <div class="bubble-menu__content">
        <nav aria-label="Navigation principale">
          <ul class="bubble-menu__links">
            ${links
              .map(
                (link, i) =>
                  `<li style="--i: ${i}"><a href="${link.href}"><span>${capAccent(link.label)}</span>${linkArrow}</a></li>`,
              )
              .join('')}
          </ul>
        </nav>
        <div class="bubble-menu__info" style="--i: ${links.length}">
          <p class="bubble-menu__label">Nous trouver</p>
          <p>${escapeHtml(CAFE.street)}<br />${escapeHtml(CAFE.city)}</p>
          <p class="bubble-menu__contact">
            <a href="${escapeHtml(CAFE.phoneHref)}">${contactIcons.phone}<span>${escapeHtml(CAFE.phone)}</span></a>
            <a href="mailto:${escapeHtml(CAFE.email)}">${contactIcons.mail}<span>${escapeHtml(CAFE.email)}</span></a>
          </p>
          <p class="bubble-menu__hours">${HOURS.map(escapeHtml).join('<br />')}</p>
        </div>
      </div>
    </dialog>
  `;

  const bubble = header.querySelector<HTMLButtonElement>('.menu-bubble')!;
  const menu = header.querySelector<HTMLDialogElement>('.bubble-menu')!;
  const closeButton = header.querySelector<HTMLButtonElement>('.bubble-menu__close')!;
  const closeBurger = closeButton.querySelector<HTMLElement>('.burger')!;

  const setOrigin = () => {
    const rect = bubble.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const width = window.innerWidth;
    const height = window.innerHeight;

    menu.style.setProperty('--bubble-x', `${x}px`);
    menu.style.setProperty('--bubble-y', `${y}px`);
    // Layout width, not the on-screen one: the bubble may still be scaling in, or zoomed on hover.
    menu.style.setProperty('--bubble-r', `${bubble.offsetWidth / 2}px`);

    // Desktop: far enough to cover the whole screen, toolbars included. Phones: the sheet
    // under the red tab (at most the screen less 2rem).
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const fullHeight = mobileQuery.matches ? height - 2 * root : Math.max(height, screen.height);
    const reach = Math.hypot(Math.max(x, width - x), Math.max(y, fullHeight - y));
    menu.style.setProperty('--bubble-reach', `${reach}px`);
  };

  /** Resolves once the menu's current animation ends, or after a fallback delay. */
  const settled = () => {
    const animations = Promise.all(menu.getAnimations().map((animation) => animation.finished));
    const timeout = new Promise((resolve) => setTimeout(resolve, ANIMATION_FALLBACK_MS));
    return Promise.race([animations, timeout]);
  };

  let restoreBar: (() => void) | null = null;

  // Scroll position frozen while the menu is open. On touch screens, overflow:hidden on the
  // root resizes the viewport and leaves a white strip under Safari's toolbar, so the body
  // is pinned instead. This only picks the locking method; the layout is the same.
  let lockedScroll = 0;

  const lockPage = () => {
    document.documentElement.classList.add('is-menu-open');
    if (!mobileQuery.matches) {
      document.documentElement.style.overflow = 'hidden';
      return;
    }
    lockedScroll = window.scrollY;
    const { body } = document;
    body.style.position = 'fixed';
    body.style.top = `-${lockedScroll}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  };

  const unlockPage = () => {
    const { body } = document;
    const locked = body.style.position === 'fixed';
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('is-menu-open');
    if (locked) window.scrollTo(0, lockedScroll);
  };

  const open = () => {
    if (menu.open) return;
    setOrigin();
    menu.classList.remove('is-closing');
    lockPage();
    // Phones: Safari's bottom strip takes the scrim over the bordeaux while the sheet is open.
    if (mobileQuery.matches) restoreBar = tintBrowserBar('#370000');
    menu.showModal();
    bubble.setAttribute('aria-expanded', 'true');
    // The bars need one painted frame as three bars before they can fold into the cross.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => closeBurger.classList.add('is-cross'));
    });
  };

  // A link to a section of this same page, followed once the menu has closed and the
  // page scroll is unlocked (unlocking restores the old position).
  let pendingSection: HTMLElement | null = null;

  const finishClose = () => {
    if (!menu.classList.contains('is-closing')) return;
    menu.close();
    menu.classList.remove('is-closing');
    unlockPage();
    restoreBar?.();
    restoreBar = null;
    bubble.setAttribute('aria-expanded', 'false');
    bubble.focus({ preventScroll: true });
    if (pendingSection) {
      pendingSection.scrollIntoView();
      pendingSection = null;
    }
  };

  const close = () => {
    if (!menu.open || menu.classList.contains('is-closing')) return;
    setOrigin();
    menu.classList.add('is-closing');
    closeBurger.classList.remove('is-cross');
    settled().then(finishClose);
  };

  // Safari settles how it draws its address bar when the page first paints and only looks
  // again when the layout changes, as it does when the menu opens and closes (after which
  // the bar is transparent). In development the styles also arrive after that first
  // paint. So once the page is ready, the menu's page lock is held for a moment and
  // released, then the page scrolls 1px and back: invisible, and Safari looks again.
  // A page opened on a section (/menu.html#contact) may grow above it while locked (the
  // menu PDF's pages arrive), so unlocking lands on that section again rather than on the
  // old offset, unless the visitor has already scrolled on their own.
  let touched = false;
  const markTouched = () => {
    touched = true;
  };
  window.addEventListener('touchstart', markTouched, { once: true, passive: true });
  window.addEventListener('wheel', markTouched, { once: true, passive: true });

  const refreshBrowserBar = () => {
    if (!mobileQuery.matches || menu.open) return;
    window.setTimeout(() => {
      if (menu.open) return;
      lockPage();
      window.setTimeout(() => {
        if (menu.open) return;
        unlockPage();
        const section = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
        if (section && !touched) section.scrollIntoView();
        const y = window.scrollY;
        window.scrollTo(0, y + 1);
        requestAnimationFrame(() => window.scrollTo(0, y));
      }, 300);
    }, 150);
  };

  if (document.readyState === 'complete') refreshBrowserBar();
  else window.addEventListener('load', refreshBrowserBar, { once: true });
  // Coming back to the page (back button, reopened tab).
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) refreshBrowserBar();
  });

  bubble.addEventListener('click', open);
  closeButton.addEventListener('click', close);

  menu.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  // Phones: a tap on the page under the sheet closes it.
  menu.addEventListener('click', (event) => {
    if (mobileQuery.matches && event.target === menu) close();
  });

  menu.querySelector('nav')!.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('a');
    if (!link) return;
    const url = new URL(link.href);
    const section = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (url.pathname === location.pathname && section) {
      event.preventDefault();
      history.pushState(null, '', url.hash);
      pendingSection = section;
    }
    close();
  });

  window.addEventListener('resize', () => {
    if (menu.open) setOrigin();
  });

  mountPageTransition();
  // The footer exists once the page has appended it after the header.
  queueMicrotask(() => mountFooterSeam(header));
  return header;
}

/** Phones: the footer is the header's bordeaux, so while it runs under the header the
 *  header gets a soft shadow along its bottom (header.css) to keep the edge. The observer's
 *  root is the band the header covers at the top of the screen. */
function mountFooterSeam(header: HTMLElement) {
  const footer = document.querySelector<HTMLElement>('.site-footer');
  if (!footer) return;

  let observer: IntersectionObserver | null = null;
  let band = -1;

  const observe = () => {
    const height = header.offsetHeight;
    const next = Math.max(0, window.innerHeight - height);
    if (next === band) return;
    band = next;
    observer?.disconnect();
    observer = new IntersectionObserver(
      ([entry]) => header.classList.toggle('is-over-footer', entry.isIntersecting),
      { rootMargin: `0px 0px -${band}px 0px` },
    );
    observer.observe(footer);
  };

  observe();
  window.addEventListener('resize', observe);
}
