import './style.css';
import './legal-page.css';
import { createHeader } from './components/header';
import { createFooter } from './components/footer';
import { applyContent, CAFE, LEGAL_LINKS } from './components/cafe-info';
import { escapeHtml, loadContent } from './api';

applyContent(await loadContent());

// One entry for the three legal pages; the page says which one in <body data-legal>.
// Their texts are not written yet: each page only has its title and a note.
const key = document.body.dataset.legal;
const page = LEGAL_LINKS.find((link) => link.key === key) ?? LEGAL_LINKS[0];

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const main = document.createElement('main');
  main.className = 'legal-page';
  // The mentions page may show the address and email already published on the site.
  const contact =
    page.key === 'mentions'
      ? `<p class="legal-page__text">${escapeHtml(CAFE.street)}<br />${escapeHtml(CAFE.city)}<br /><a href="mailto:${escapeHtml(CAFE.email)}">${escapeHtml(CAFE.email)}</a></p>`
      : '';
  main.innerHTML = `
    <h1 class="legal-page__title">${page.label}</h1>
    <p class="legal-page__text">Cette page est en cours de rédaction.</p>
    ${contact}
  `;
  app.append(createHeader(), main, createFooter());
}
