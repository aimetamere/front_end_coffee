import './gallery.css';
import { tintBrowserBar } from './theme-color';

/** Web-sized photos only; the full-size originals in public/photo/ start with "_". */
const photos = [
  { src: '/photo/web/dsf2361.jpg', alt: 'Photo du café : le chef dresse les assiettes en cuisine' },
  { src: '/photo/web/dsf2395.jpg', alt: 'Photo du café : deux assiettes de pâtes prêtes à servir' },
  { src: '/photo/web/dsf2397.jpg', alt: 'Photo du café : la salle et ses clients, vue depuis le comptoir' },
  { src: '/photo/web/dsf2428.jpg', alt: 'Photo du café : des pâtes versées dans une assiette' },
  { src: '/photo/web/dsf2453.jpg', alt: 'Photo du café : deux plats assaisonnés au passe' },
  { src: '/photo/web/dsf2515.jpg', alt: 'Photo du café : un cuisinier assaisonne un plat' },
  { src: '/photo/web/dsf2605.jpg', alt: 'Photo du café : le chef garnit des assiettes de salade' },
  { src: '/photo/web/dsf2672.jpg', alt: 'Photo du café : une rangée de plats en cours de dressage' },
  { src: '/photo/web/dsf2679.jpg', alt: 'Photo du café : soupes et salades prêtes à partir en salle' },
];

const PHOTO_WIDTH = 2000;
const PHOTO_HEIGHT = 1333;
/** Pointer travel (px) after which a press on the strip counts as a drag, not a click. */
const DRAG_THRESHOLD = 5;

const mobileQuery = window.matchMedia('(max-width: 768px)');

export function createGallery(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'gallery';
  section.setAttribute('aria-labelledby', 'gallery-title');
  section.innerHTML = `
    <img class="gallery__shape gallery__shape--arch" src="/shapes/Shape10.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
    <div class="gallery__head section-heading">
      <img class="section-heading__oval" src="/shapes/Shape2.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <h2 id="gallery-title" class="gallery__title">Galerie</h2>
      <p class="section-subtitle">Une cuisine faite avec passion, à partir de produits frais.</p>
    </div>
    <div class="gallery__body">
    <img class="gallery__shape gallery__shape--blue" src="/shapes/Shape9.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
    <ul class="gallery__grid">
      ${photos
        .map(
          (photo, i) => `
        <li class="gallery__item">
          <button type="button" class="gallery__tile" data-index="${i}" aria-label="Agrandir : ${photo.alt}">
            <img class="gallery__image" src="${photo.src}" alt="${photo.alt}" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" loading="lazy" decoding="async" />
          </button>
        </li>`,
        )
        .join('')}
    </ul>
    <!-- Phones only: the way to the contact form, under the photos. -->
    <div class="gallery__cta">
      <a class="about__cta-link about__cta-link--outline" href="/menu.html#contact">
        Contactez-nous
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>
    </div>
    </div>

    <dialog class="gallery-lightbox" aria-label="Photo agrandie">
      <button type="button" class="gallery-lightbox__close" aria-label="Fermer la photo"><span aria-hidden="true">×</span></button>
      <div class="gallery-lightbox__stage">
        <img class="gallery-lightbox__image" src="" alt="" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" />
        <div class="gallery-lightbox__strip" role="group" aria-label="Toutes les photos">
          ${photos
            .map(
              (photo, i) => `
            <button type="button" class="gallery-lightbox__thumb" data-index="${i}" aria-label="Photo ${i + 1} sur ${photos.length}">
              <img src="${photo.src}" alt="" width="${PHOTO_WIDTH}" height="${PHOTO_HEIGHT}" loading="lazy" decoding="async" draggable="false" />
            </button>`,
            )
            .join('')}
        </div>
      </div>
    </dialog>
  `;

  const lightbox = section.querySelector<HTMLDialogElement>('.gallery-lightbox')!;
  const stage = lightbox.querySelector<HTMLElement>('.gallery-lightbox__stage')!;
  const large = lightbox.querySelector<HTMLImageElement>('.gallery-lightbox__image')!;
  const strip = lightbox.querySelector<HTMLElement>('.gallery-lightbox__strip')!;
  const thumbs = [...strip.querySelectorAll<HTMLButtonElement>('.gallery-lightbox__thumb')];
  const closeButton = lightbox.querySelector<HTMLButtonElement>('.gallery-lightbox__close')!;

  let current = 0;

  const show = (index: number) => {
    current = index;
    const photo = photos[index];
    large.src = photo.src;
    large.alt = photo.alt;
    // Replays the fade on each swap.
    large.classList.remove('is-swapping');
    void large.offsetWidth;
    large.classList.add('is-swapping');
    thumbs.forEach((thumb, i) => {
      const active = i === index;
      thumb.classList.toggle('is-active', active);
      if (active) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    thumbs[index].scrollIntoView({ block: 'nearest' });
  };

  // Page scroll is frozen while the overlay is open. On phones, overflow:hidden on the root
  // is not enough (and resizes the viewport in Safari), so the body is pinned instead.
  let lockedScroll = 0;

  const lockPage = () => {
    if (!mobileQuery.matches) {
      document.documentElement.style.overflow = 'hidden';
      return;
    }
    lockedScroll = window.scrollY;
    Object.assign(document.body.style, {
      position: 'fixed',
      top: `-${lockedScroll}px`,
      left: '0',
      right: '0',
      width: '100%',
    });
  };

  const unlockPage = () => {
    const { body } = document;
    const pinned = body.style.position === 'fixed';
    Object.assign(body.style, { position: '', top: '', left: '', right: '', width: '' });
    document.documentElement.style.overflow = '';
    if (pinned) window.scrollTo(0, lockedScroll);
  };

  // Safari's bottom strip takes the scrim's dark grey while the viewer is open.
  let restoreBar: (() => void) | null = null;

  const open = (index: number) => {
    if (lightbox.open) return;
    lockPage();
    restoreBar = tintBrowserBar('#3a3a3a');
    lightbox.showModal();
    show(index);
  };

  const close = () => {
    if (lightbox.open) lightbox.close();
  };

  lightbox.addEventListener('close', () => {
    unlockPage();
    restoreBar?.();
    restoreBar = null;
  });

  section.querySelector('.gallery__grid')!.addEventListener('click', (event) => {
    const tile = (event.target as HTMLElement).closest<HTMLButtonElement>('.gallery__tile');
    if (tile) open(Number(tile.dataset.index));
  });

  closeButton.addEventListener('click', close);

  // The backdrop is the dialog itself and the empty space of the stage around the photo.
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target === stage) close();
  });

  // Escape fires "cancel", which closes the dialog; "close" then unlocks the page.

  // Up and down arrows step through the photos, wrapping at either end.
  lightbox.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    show((current + step + photos.length) % photos.length);
  });

  // Dragging the strip with a mouse scrolls it. Touch already scrolls it natively.
  let dragStartY = 0;
  let dragStartScroll = 0;
  let dragging = false;
  let dragged = false;

  strip.addEventListener('pointerdown', (event) => {
    dragged = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragging = true;
    dragStartY = event.clientY;
    dragStartScroll = strip.scrollTop;
  });

  strip.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const delta = event.clientY - dragStartY;
    if (!dragged && Math.abs(delta) > DRAG_THRESHOLD) {
      dragged = true;
      strip.setPointerCapture(event.pointerId);
      strip.classList.add('is-dragging');
    }
    if (dragged) strip.scrollTop = dragStartScroll - delta;
  });

  const endDrag = () => {
    dragging = false;
    strip.classList.remove('is-dragging');
  };
  strip.addEventListener('pointerup', endDrag);
  strip.addEventListener('pointercancel', endDrag);

  strip.addEventListener('click', (event) => {
    // A drag ends with a click on whatever thumbnail is under the pointer. Ignore that one.
    if (dragged) {
      dragged = false;
      return;
    }
    const thumb = (event.target as HTMLElement).closest<HTMLButtonElement>('.gallery-lightbox__thumb');
    if (thumb) show(Number(thumb.dataset.index));
  });

  return section;
}
