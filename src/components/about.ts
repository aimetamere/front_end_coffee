import './about.css';
import { capAccent } from '../style/cap-accent';
import { escapeHtml } from '../api';
import { ABOUT } from './cafe-info';

const interior = {
  src: '/interior.jpg',
  alt: 'La salle du café, avec ses tables, ses chaises rouges et bleues et ses suspensions lumineuses',
};

export function createAbout(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'about';
  section.className = 'about';
  section.setAttribute('aria-labelledby', 'about-title');
  section.innerHTML = `
    <div class="about__inner">
      <img class="about__shape about__shape--bordeaux" src="/shapes/Shape7.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
      <div class="about__copy">
        <img class="about__shape about__shape--oval" src="/shapes/Shape2.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
        <h2 id="about-title" class="about__title">${capAccent('À propos de nous')}</h2>
        <p class="about__subtitle">${escapeHtml(ABOUT.subtitle)}</p>
        <p class="about__text">
          ${escapeHtml(ABOUT.text).replace(/\n/g, '<br />')}
        </p>
      </div>
      <figure class="about__media">
        <img class="about__photo" src="${interior.src}" alt="${interior.alt}" loading="lazy" />
      </figure>
    </div>
    <div class="about__cta">
      <a class="about__cta-link" href="/menu.html">
        Voir le menu de saison
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>
    </div>
  `;

  return section;
}
