import './header.css';

const links = [
  { label: 'Accueil', href: '#' },
  { label: 'Menu', href: '#menu' },
  { label: 'À propos', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-header__logo" href="#">Café du Conservatoire</a>
    <nav class="site-header__nav" aria-label="Navigation principale">
      <ul>
        ${links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
      </ul>
    </nav>
  `;
  return header;
}
