import './footer.css';
import { createSocialLinks } from '../style/button-social';
import { capAccent } from '../style/cap-accent';
import { CAFE, HOURS, LEGAL_LINKS, NAV_LINKS } from './cafe-info';
import { contactIcons } from './contact-icons';

/** Red footer: name, tagline and links; address, phone, email and hours; the copyright.
 *  One column on a phone, in that order. The red ends in a wave over a white band with
 *  "Suivez-nous" and Instagram, so the page ends white like it starts. */
const icons = contactIcons;

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__start">
        <div class="site-footer__brand">
          <p class="site-footer__name">Café du Conservatoire</p>
          <p class="site-footer__tagline">Café · Musique · Bonne bouffe</p>
        </div>
        <nav class="site-footer__nav" aria-label="Pied de page">
          <ul>
            ${NAV_LINKS.map((link) => `<li><a href="${link.href}"><span>${capAccent(link.label)}</span></a></li>`).join('')}
          </ul>
        </nav>
      </div>
      <div class="site-footer__info">
        <p>${CAFE.street}<br />${CAFE.city}</p>
        <p class="site-footer__contact">
          <a href="${CAFE.phoneHref}">${icons.phone}<span>${CAFE.phone}</span></a>
          <a href="mailto:${CAFE.email}">${icons.mail}<span>${CAFE.email}</span></a>
        </p>
        <p class="site-footer__hours">${HOURS.join('<br />')}</p>
      </div>
      <div class="site-footer__legal">
        <a class="site-footer__mark" href="/" aria-label="Café du Conservatoire, accueil">
          <img src="/logo-og.png" alt="" width="1094" height="962" loading="lazy" />
        </a>
        <span class="site-footer__rule" aria-hidden="true"></span>
        <div class="site-footer__legal-row">
          <p class="site-footer__copy">© ${new Date().getFullYear()} Café du Conservatoire</p>
          <ul aria-label="Informations légales">
            ${LEGAL_LINKS.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    <svg class="site-footer__wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0H1440V34C1320 66 1180 76 1020 56C860 36 720 6 540 18C360 30 220 72 0 46Z" />
    </svg>
    <div class="site-footer__social">
      <p class="site-footer__label">Suivez-nous</p>
    </div>
  `;

  footer.querySelector('.site-footer__social')!.append(createSocialLinks());
  return footer;
}
