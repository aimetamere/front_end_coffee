import './about.css';
import { capAccent } from '../style/cap-accent';

const interior = {
  src: '/interior.jpg',
  alt: 'La salle du café, avec ses tables, ses chaises rouges et bleues et ses suspensions lumineuses',
};

const arrowIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 5 8 12l7 7" />
  </svg>`;

export function createAbout(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'about';
  section.className = 'about';
  section.setAttribute('aria-labelledby', 'about-title');
  section.innerHTML = `
    <img class="about__shape about__shape--circle" src="/shapes/Shape3.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
    <img class="about__shape about__shape--cream" src="/shapes/Shape5.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
    <div class="about__inner">
      <div class="about__copy">
        <img class="about__shape about__shape--oval" src="/shapes/Shape2.png" alt="" aria-hidden="true" width="1000" height="1000" loading="lazy" />
        <h2 id="about-title" class="about__title">${capAccent('À propos de nous')}</h2>
        <p class="about__subtitle">Un café au cœur du Conservatoire de Musique de Genève</p>
        <p class="about__text">
          Découvrez un café où la convivialité se mêle à la gastronomie, au cœur du
          Conservatoire de Musique de Genève. Sous la direction du Chef Angelo Citiulo,
          notre café vous propose une sélection exquise de sandwiches, salades et plats
          chauds, concoctés avec soin et passion. Que ce soit pour une pause déjeuner
          rapide entre deux répétitions ou pour savourer un repas gourmand avant un
          concert, notre menu saura combler toutes vos envies. Rejoignez-nous pour une
          expérience culinaire harmonieuse et savourez chaque bouchée dans un cadre
          inspirant où la musique et la cuisine fusionnent pour votre plus grand plaisir.
        </p>
      </div>
      <figure class="about__media" id="about-media">
        <img class="about__photo" src="${interior.src}" alt="${interior.alt}" loading="lazy" />
        <button
          type="button"
          class="about__toggle"
          aria-controls="about-media"
          aria-expanded="false"
          aria-label="Agrandir la photo"
        >${arrowIcon}</button>
      </figure>
    </div>
    <div class="about__cta">
      <a class="about__cta-link" href="/menu.html">
        Voir le menu
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </a>
    </div>
  `;

  const toggle = section.querySelector<HTMLButtonElement>('.about__toggle')!;
  toggle.addEventListener('click', () => {
    const expanded = section.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Réduire la photo' : 'Agrandir la photo');
  });

  return section;
}
