import './header.css';
import { capAccent } from '../style/cap-accent';
import { CAFE, HOURS, NAV_LINKS as links } from './cafe-info';

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
    <a class="site-header__mark" href="/" aria-label="Café du Conservatoire, accueil">
      <img src="/logo-og.png" alt="" width="1094" height="962" />
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
          <p><a href="${CAFE.phoneHref}">${CAFE.phone}</a></p>
          <p><a href="mailto:${CAFE.email}">${CAFE.email}</a></p>
          <p class="bubble-menu__hours">${HOURS.join('<br />')}</p>
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

    // Far enough to cover the whole screen, toolbars included.
    const fullHeight = Math.max(height, screen.height);
    const reach = Math.hypot(Math.max(x, width - x), Math.max(y, fullHeight - y));
    menu.style.setProperty('--bubble-reach', `${reach}px`);
  };

  /** Resolves once the menu's current animation ends, or after a fallback delay. */
  const settled = () => {
    const animations = Promise.all(menu.getAnimations().map((animation) => animation.finished));
    const timeout = new Promise((resolve) => setTimeout(resolve, ANIMATION_FALLBACK_MS));
    return Promise.race([animations, timeout]);
  };

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

  // The phone logo stays out of the hero (its wordmark is the name): hidden while the hero
  // reaches the top tenth of the screen, where the logo sits. Pages without a hero show it.
  header.classList.add('is-over-hero');
  requestAnimationFrame(() => {
    const hero = document.querySelector('.hero-stack');
    if (!hero) {
      header.classList.remove('is-over-hero');
      return;
    }
    new IntersectionObserver(
      ([entry]) => header.classList.toggle('is-over-hero', entry.isIntersecting),
      { rootMargin: '0px 0px -90% 0px' },
    ).observe(hero);
  });

  bubble.addEventListener('click', open);
  closeButton.addEventListener('click', close);

  menu.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
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

  return header;
}
