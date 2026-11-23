import './button-social.css';

type Social = {
  id: 'instagram';
  label: string;
  href: string;
  icon: string;
};

/** Only Instagram for now; the footer is the one place these links appear. */
const socials: Social[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/cafeduconservatoire/',
    icon: `
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>`,
  },
];

export function createSocialLinks(): HTMLUListElement {
  const list = document.createElement('ul');
  list.className = 'social-links';
  list.innerHTML = socials
    .map(
      (social) => `
      <li class="social-links__item">
        <a
          class="social-links__link"
          data-social="${social.id}"
          href="${social.href}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${social.label}"
        >
          <span class="social-links__filled"></span>
          ${social.icon}
        </a>
        <span class="social-links__tooltip" aria-hidden="true">${social.label}</span>
      </li>`,
    )
    .join('');
  return list;
}
