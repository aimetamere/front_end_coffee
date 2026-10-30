import './about.css';
import { capAccent } from '../style/cap-accent';

export function createAbout(): HTMLElement {
  const section = document.createElement('section');
  section.id = 'about';
  section.className = 'about';
  section.setAttribute('aria-labelledby', 'about-title');
  section.innerHTML = `
    <div class="about__inner">
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
  `;
  return section;
}
