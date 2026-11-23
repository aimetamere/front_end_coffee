import './header.css';
import { capAccent } from '../style/cap-accent';

// Full paths, so the links also work from the menu page.
const links = [
  { label: 'Accueil', href: '/' },
  { label: 'Menu', href: '/menu.html' },
  { label: 'À propos', href: '/#about' },
  { label: 'Contact', href: '#contact' },
];

/** Moves on even if a menu animation never reports finishing (e.g. background tabs). */
const ANIMATION_FALLBACK_MS = 900;
const mobileQuery = window.matchMedia('(max-width: 768px)');

const burger = `
  <span class="burger" aria-hidden="true">
    <span class="burger__bar burger__bar--top"></span>
    <span class="burger__bar burger__bar--middle"></span>
    <span class="burger__bar burger__bar--bottom"></span>
  </span>`;

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <svg class="site-header__lip" viewBox="0 0 120 80" aria-hidden="true">
      <path d="M-2000 -100H140V64H48A20 20 0 0 1 28 44V22A16 16 0 0 0 12 6H-2000Z" />
    </svg>
    <span class="site-header__sphere" aria-hidden="true"></span>
    <a class="site-header__logo" href="#">Café du Conservatoire</a>
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
        <img class="bubble-menu__mark" src="/logo-og.png" alt="" />
      </span>
      <img class="bubble-menu__wordmark" src="/logo-og.png" alt="" aria-hidden="true" />
      <button type="button" class="bubble-menu__close" aria-label="Fermer le menu">${burger}</button>
      <div class="bubble-menu__content">
        <nav aria-label="Navigation principale">
          <ul class="bubble-menu__links">
            ${links
              .map(
                (link, i) =>
                  `<li style="--i: ${i}"><a href="${link.href}">${capAccent(link.label)}</a></li>`,
              )
              .join('')}
          </ul>
        </nav>
        <div class="bubble-menu__info" style="--i: ${links.length}">
          <p class="bubble-menu__label">Nous trouver</p>
          <p>Place de Neuve 5, Genève</p>
          <p><a href="tel:+41223196055">022 319 60 55</a></p>
          <p><a href="mailto:info@cafeconservatoire.ch">info@cafeconservatoire.ch</a></p>
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

    if (mobileQuery.matches) {
      const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const panelHeight = Math.min(height * 0.8, 36 * root);
      const reach = Math.hypot(Math.max(x, width - x), Math.max(y, panelHeight - y));
      menu.style.setProperty('--bubble-reach', `${reach}px`);
      menu.style.removeProperty('--bubble-open-x');
      menu.style.removeProperty('--bubble-open-y');
    } else {
      const fullHeight = Math.max(height, screen.height);
      const reach = Math.hypot(Math.max(x, width - x), Math.max(y, fullHeight - y));
      menu.style.setProperty('--bubble-reach', `${reach}px`);
      menu.style.removeProperty('--bubble-open-x');
      menu.style.removeProperty('--bubble-open-y');
    }
  };

  /** Resolves once the menu's current animation ends, or after a fallback delay. */
  const settled = () => {
    const animations = Promise.all(menu.getAnimations().map((animation) => animation.finished));
    const timeout = new Promise((resolve) => setTimeout(resolve, ANIMATION_FALLBACK_MS));
    return Promise.race([animations, timeout]);
  };

  // Scroll position frozen while the menu is open. On phones, overflow:hidden on the
  // root resizes the viewport and leaves a white strip under Safari's toolbar.
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
    menu.showModal();
    bubble.setAttribute('aria-expanded', 'true');
    // The bars need one painted frame as three bars before they can fold into the cross.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => closeBurger.classList.add('is-cross'));
    });
  };

  const finishClose = () => {
    if (!menu.classList.contains('is-closing')) return;
    menu.close();
    menu.classList.remove('is-closing');
    unlockPage();
    bubble.setAttribute('aria-expanded', 'false');
    bubble.focus({ preventScroll: true });
  };

  const close = () => {
    if (!menu.open || menu.classList.contains('is-closing')) return;
    setOrigin();
    menu.classList.add('is-closing');
    closeBurger.classList.remove('is-cross');
    settled().then(finishClose);
  };

  bubble.addEventListener('click', open);
  closeButton.addEventListener('click', close);

  menu.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  menu.addEventListener('click', (event) => {
    if (mobileQuery.matches && event.target === menu) close();
  });

  menu.querySelector('nav')!.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) close();
  });

  window.addEventListener('resize', () => {
    if (menu.open) setOrigin();
  });

  return header;
}
