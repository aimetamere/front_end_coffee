import './stacking-photos.css';

type StackingPhoto = {
  src: string;
  alt: string;
};

const photos: StackingPhoto[] = [
  { src: '/photo-hero/web/dsf2874.jpg', alt: 'L’entrée du Café du Conservatoire' },
  { src: '/photo-hero/web/dsf2387.jpg', alt: 'Un cuisinier ajoute des herbes sur une assiette de pâtes' },
  { src: '/photo-hero/web/dsf2515.jpg', alt: 'Un membre de l’équipe en cuisine' },
  { src: '/photo-hero/web/dsf2605.jpg', alt: 'Dressage des entrées sur le passe' },
  { src: '/photo-hero/web/dsf2653.jpg', alt: 'Une sauce versée à la louche dans une assiette' },
];

/** How much each card shrinks for every card stacked on top of it. */
const SCALE_STEP = 0.05;
/** Vertical offset (px) between cards so the edges of the stack stay visible. */
const STACK_OFFSET = 16;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export type StackingPhotos = {
  element: HTMLUListElement;
  /** How many photos stack. The hero uses this to size its scroll. */
  count: number;
  render: (progress: number, travel: number) => void;
};

export function createStackingPhotos(): StackingPhotos {
  const element = document.createElement('ul');
  element.className = 'stacking-photos';
  element.innerHTML = photos
    .map(
      (photo, i) => `
        <li class="stacking-photos__card" style="z-index: ${i + 1}">
          <img
            src="${photo.src}"
            alt="${photo.alt}"
            loading="${i === 0 ? 'eager' : 'lazy'}"
            decoding="async"
          />
        </li>`,
    )
    .join('');

  const cards = [...element.querySelectorAll<HTMLElement>('.stacking-photos__card')];
  const images = cards.map((card) => card.querySelector('img')!);
  const steps = photos.length - 1;
  const stackCenter = (steps * STACK_OFFSET) / 2;
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  const render = (progress: number, travel: number) => {
    const horizontal = mobileQuery.matches;
    const distance = horizontal ? (element.parentElement?.clientWidth ?? travel) : travel;
    const landed = cards.map((_, i) => (i === 0 ? 1 : easeOut(clamp(progress * steps - (i - 1)))));

    cards.forEach((card, i) => {
      const above = landed.slice(i + 1).reduce((sum, t) => sum + t, 0);
      const restY = i * STACK_OFFSET - stackCenter;
      const shift = (1 - landed[i]) * distance;
      const scale = 1 - above * SCALE_STEP;
      // Phones slide in from the right; wider screens rise from below.
      const position = horizontal
        ? `translate3d(${shift}px, calc(-50% + ${restY}px), 0)`
        : `translate3d(0, calc(-50% + ${restY + shift}px), 0)`;

      card.style.transform = `${position} scale(${scale})`;
      // Stays zoomed in when landed, so the photo always covers the card's edges.
      images[i].style.transform = `scale(${1.3 - landed[i] * 0.2})`;
    });
  };

  return { element, count: photos.length, render };
}
