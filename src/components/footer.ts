import './footer.css';
import { createSocialLinks } from '../style/button-social';
import { capAccent } from '../style/cap-accent';
import { CAFE, HOURS, NAV_LINKS } from './cafe-info';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer__main">
      <div class="site-footer__start">
        <div class="site-footer__brand">
          <p class="site-footer__name">Café du Conservatoire</p>
          <p class="site-footer__tagline">Café · Musique · Bonne bouffe</p>
        </div>
        <nav class="site-footer__nav" aria-label="Pied de page">
          <ul>
            ${NAV_LINKS.map((link) => `<li><a href="${link.href}">${capAccent(link.label)}</a></li>`).join('')}
          </ul>
        </nav>
      </div>
      <div class="site-footer__info">
        <p>${CAFE.street}<br />${CAFE.city}</p>
        <p><a href="${CAFE.phoneHref}">${CAFE.phone}</a><br /><a href="mailto:${CAFE.email}">${CAFE.email}</a></p>
        <p class="site-footer__hours">${HOURS.join('<br />')}</p>
      </div>
      <p class="site-footer__copy">© ${new Date().getFullYear()} Café du Conservatoire</p>
    </div>
    <div class="site-footer__social">
      <div class="site-footer__arch">
        <p class="site-footer__label">Suivez-nous</p>
      </div>
    </div>
  `;

  footer.querySelector('.site-footer__arch')!.append(createSocialLinks());
  return footer;
}
