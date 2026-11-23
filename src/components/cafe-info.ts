/** The café's details, shared by the open menu, the footer and the contact section. */
export const CAFE = {
  street: 'Place de Neuve 5',
  city: '1204 Genève',
  phone: '022 319 60 55',
  phoneHref: 'tel:+41223196055',
  email: 'info@cafeconservatoire.ch',
};

export const HOURS = ['Lundi au mardi : 8h30 à 21h00', 'Le samedi : 8h30 à 18h00', 'Dimanche : fermé'];

/** Site navigation. Full paths, so the links also work from the menu page. */
/** Swiss legal pages, linked from the footer. Their texts are not written yet. */
export const LEGAL_LINKS = [
  { key: 'mentions', label: 'Mentions légales', href: '/mentions-legales.html' },
  { key: 'confidentialite', label: 'Politique de confidentialité', href: '/confidentialite.html' },
  { key: 'cookies', label: 'Cookies', href: '/cookies.html' },
];

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Menu', href: '/menu.html' },
  { label: 'À propos', href: '/#about' },
  { label: 'Contact', href: '/menu.html#contact' },
];
