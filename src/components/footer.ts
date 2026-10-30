import './footer.css';
import { createSocialLinks } from '../style/button-social';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer__main">
      <div class="site-footer__brand">
        <p class="site-footer__name">Café du Conservatoire</p>
        <p class="site-footer__tagline">Café · Musique · Bonne bouffe</p>
      </div>
      <div class="site-footer__info">
        <p>info@cafeconservatoire.ch</p>
        <p>Horaires à venir</p>
      </div>
      <p class="site-footer__copy">© ${new Date().getFullYear()} Café du Conservatoire</p>
    </div>
    <svg class="site-footer__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0H1440V36C1320 12 1200 12 1080 36S840 60 720 36 480 12 360 36 120 60 0 36Z" />
    </svg>
    <div class="site-footer__social">
      <p class="site-footer__label">Suivez-nous</p>
    </div>
  `;

  footer.querySelector('.site-footer__social')!.append(createSocialLinks());
  return footer;
}
