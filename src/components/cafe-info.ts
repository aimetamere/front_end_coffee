import type { SiteContent } from '../api';

/** The café's details, shared by the open menu, the footer and the contact section.
 *  These are the defaults; applyContent() overwrites them in place when the API has content. */
export const CAFE = {
  street: 'Place de Neuve 5',
  city: '1204 Genève',
  phone: '022 319 60 55',
  phoneHref: 'tel:+41223196055',
  email: 'info@cafeconservatoire.ch',
};

export const HOURS = ['Lundi au mardi : 8h30 à 21h00', 'Le samedi : 8h30 à 18h00', 'Dimanche : fermé'];

export const MENU = {
  pdf: '/menu.pdf',
  subtitle: 'Le menu de saison imaginé par notre chef Angelo.',
};

export const ABOUT = {
  subtitle: 'Un café au cœur du Conservatoire de Musique de Genève',
  text: `Découvrez un café où la convivialité se mêle à la gastronomie, au cœur du Conservatoire de Musique de Genève. Sous la direction du Chef Angelo Citiulo, notre café vous propose une sélection exquise de sandwiches, salades et plats chauds, concoctés avec soin et passion. Que ce soit pour une pause déjeuner rapide entre deux répétitions ou pour savourer un repas gourmand avant un concert, notre menu saura combler toutes vos envies. Rejoignez-nous pour une expérience culinaire harmonieuse et savourez chaque bouchée dans un cadre inspirant où la musique et la cuisine fusionnent pour votre plus grand plaisir.`,
};

export interface GalleryPhoto {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Web-sized photos only; the full-size originals in public/photo/ start with "_". */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: '/photo/web/dsf2361.jpg', alt: 'Photo du café : le chef dresse les assiettes en cuisine' },
  { src: '/photo/web/dsf2395.jpg', alt: 'Photo du café : deux assiettes de pâtes prêtes à servir' },
  { src: '/photo/web/dsf2397.jpg', alt: 'Photo du café : la salle et ses clients, vue depuis le comptoir' },
  { src: '/photo/web/dsf2428.jpg', alt: 'Photo du café : des pâtes versées dans une assiette' },
  { src: '/photo/web/dsf2453.jpg', alt: 'Photo du café : deux plats assaisonnés au passe' },
  { src: '/photo/web/dsf2515.jpg', alt: 'Photo du café : un cuisinier assaisonne un plat' },
  { src: '/photo/web/dsf2605.jpg', alt: 'Photo du café : le chef garnit des assiettes de salade' },
  { src: '/photo/web/dsf2672.jpg', alt: 'Photo du café : une rangée de plats en cours de dressage' },
  { src: '/photo/web/dsf2679.jpg', alt: 'Photo du café : soupes et salades prêtes à partir en salle' },
];

/** "tel:" link from a number as people write it: digits and a leading +; 0… is Swiss, 00… is +. */
const toPhoneHref = (phone: string) => {
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
  else if (digits.startsWith('0')) digits = `+41${digits.slice(1)}`;
  return `tel:${digits}`;
};

/** Overwrites the defaults above with what the API sent. Call once, before the page is built. */
export function applyContent(content: SiteContent | null) {
  if (!content) return;
  const { settings, collections } = content;

  const contact = settings?.contact;
  if (contact) {
    if (contact.street) CAFE.street = contact.street;
    if (contact.city) CAFE.city = contact.city;
    if (contact.email) CAFE.email = contact.email;
    if (contact.phone) {
      CAFE.phone = contact.phone;
      CAFE.phoneHref = toPhoneHref(contact.phone);
    }
  }

  const lines = settings?.hours?.lines;
  if (lines?.length) HOURS.splice(0, HOURS.length, ...lines);

  const menu = settings?.menu;
  if (menu?.pdf?.url) MENU.pdf = menu.pdf.url;
  if (menu?.subtitle) MENU.subtitle = menu.subtitle;

  const about = settings?.about;
  if (about?.subtitle) ABOUT.subtitle = about.subtitle;
  if (about?.text) ABOUT.text = about.text;

  const gallery = collections?.gallery?.filter((item) => item.image?.url);
  if (gallery?.length) {
    GALLERY_PHOTOS.splice(
      0,
      GALLERY_PHOTOS.length,
      ...gallery.map(({ image, alt }) => ({
        src: image!.url,
        alt: alt ?? '',
        width: image!.width,
        height: image!.height,
      })),
    );
  }
}

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
