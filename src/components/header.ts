import './header.css';
import { capAccent } from '../style/cap-accent';

const links = [
  { label: 'Accueil', href: '#' },
  { label: 'Menu', href: '#menu' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/** Closes the menu even if the closing animation never reports finishing (e.g. background tabs). */
const CLOSE_FALLBACK_MS = 900;

const closeIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>`;

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
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
      <span class="menu-bubble__bar"></span>
      <span class="menu-bubble__bar"></span>
      <span class="menu-bubble__bar"></span>
    </button>

    <dialog id="bubble-menu" class="bubble-menu" aria-label="Menu">
      <span class="bubble-menu__sphere" aria-hidden="true"></span>
      <button type="button" class="bubble-menu__close" aria-label="Fermer le menu">${closeIcon}</button>
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

  const setOrigin = () => {
    const rect = bubble.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));

    menu.style.setProperty('--bubble-x', `${x}px`);
    menu.style.setProperty('--bubble-y', `${y}px`);
    menu.style.setProperty('--bubble-r', `${rect.width / 2}px`);
    menu.style.setProperty('--bubble-reach', `${reach}px`);
  };

  const open = () => {
    if (menu.open) return;
    setOrigin();
    menu.classList.remove('is-closing');
    menu.showModal();
    document.documentElement.style.overflow = 'hidden';
    bubble.setAttribute('aria-expanded', 'true');
  };

  const finishClose = () => {
    if (!menu.classList.contains('is-closing')) return;
    menu.close();
    menu.classList.remove('is-closing');
    document.documentElement.style.overflow = '';
    bubble.setAttribute('aria-expanded', 'false');
    bubble.focus({ preventScroll: true });
  };

  const close = () => {
    if (!menu.open || menu.classList.contains('is-closing')) return;
    setOrigin();
    menu.classList.add('is-closing');
    const animations = Promise.all(menu.getAnimations().map((animation) => animation.finished));
    const timeout = new Promise((resolve) => setTimeout(resolve, CLOSE_FALLBACK_MS));
    Promise.race([animations, timeout]).then(finishClose);
  };

  bubble.addEventListener('click', open);
  closeButton.addEventListener('click', close);

  menu.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });

  menu.querySelector('nav')!.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) close();
  });

  window.addEventListener('resize', () => {
    if (menu.open) setOrigin();
  });

  return header;
}
