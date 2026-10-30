import './footer.css';
import { createSocialLinks } from '../style/button-social';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer__brand">
      <p class="site-footer__name">Café du Conservatoire</p>
      <p class="site-footer__tagline">Café · Musique · Bonne bouffe</p>
    </div>
    <div class="site-footer__info">
      <p>Adresse à venir</p>
      <p>Horaires à venir</p>
    </div>
    <div class="site-footer__social">
      <p class="site-footer__label">Suivez-nous</p>
    </div>
    <p class="site-footer__copy">© ${new Date().getFullYear()} Café du Conservatoire</p>
  `;

  footer.querySelector('.site-footer__social')!.append(createSocialLinks());
  return footer;
}
