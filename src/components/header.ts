import './header.css';

const links = [
  { label: 'Accueil', href: '#' },
  { label: 'Menu', href: '#menu' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const mobileQuery = window.matchMedia('(max-width: 768px)');

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-header__logo" href="#">Café du Conservatoire</a>
    <button
      type="button"
      class="menu-toggle"
      aria-controls="site-nav"
      aria-expanded="false"
      aria-label="Ouvrir le menu"
    >
      <span class="menu-toggle__bar menu-toggle__bar--top"></span>
      <span class="menu-toggle__bar menu-toggle__bar--middle"></span>
      <span class="menu-toggle__bar menu-toggle__bar--bottom"></span>
    </button>
    <nav id="site-nav" class="site-header__nav" aria-label="Navigation principale">
      <ul>
        ${links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
      </ul>
    </nav>
  `;

  const toggle = header.querySelector<HTMLButtonElement>('.menu-toggle')!;
  const nav = header.querySelector<HTMLElement>('.site-header__nav')!;

  const setOpen = (open: boolean) => {
    header.classList.toggle('site-header--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  const isOpen = () => header.classList.contains('site-header--open');

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target as Node)) setOpen(false);
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) setOpen(false);
  });

  return header;
}
