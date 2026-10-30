import './hero.css';

type HeroPhoto = {
  src: string;
  alt: string;
};

const building: HeroPhoto = {
  src: '/photo-hero/web/dsf2871.jpg',
  alt: 'La façade du Conservatoire de musique et sa fontaine',
};

const cards: HeroPhoto[] = [
  { src: '/photo-hero/web/dsf2874.jpg', alt: 'L’entrée du Café du Conservatoire' },
  { src: '/photo-hero/web/dsf2387.jpg', alt: 'Un cuisinier ajoute des herbes sur une assiette de pâtes' },
  { src: '/photo-hero/web/dsf2515.jpg', alt: 'Un membre de l’équipe en cuisine' },
  { src: '/photo-hero/web/dsf2605.jpg', alt: 'Dressage des entrées sur le passe' },
  { src: '/photo-hero/web/dsf2653.jpg', alt: 'Une sauce versée à la louche dans une assiette' },
];

/** Scroll distance per card, as a fraction of the viewport height. */
const SCROLL_PER_CARD = 0.8;
/** How much each card shrinks for every card stacked on top of it. */
const SCALE_STEP = 0.05;
/** Vertical offset (px) between cards so the edges of the stack stay visible. */
const STACK_OFFSET = 16;
/** Share of the remaining distance covered each frame — lower is smoother. */
const EASING = 0.1;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function createHero(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'hero-stack';
  section.setAttribute('aria-label', 'Découvrir le café');

  section.innerHTML = `
    <div class="hero-stack__sticky">
      <img
        class="hero-stack__base"
        src="${building.src}"
        alt="${building.alt}"
        fetchpriority="high"
      />
      <div class="hero-stack__shade"></div>
      <ul class="hero-stack__cards">
        ${cards
          .map(
            (card, i) => `
          <li class="hero-stack__card" style="z-index: ${i + 1}">
            <img
              src="${card.src}"
              alt="${card.alt}"
              loading="${i === 0 ? 'eager' : 'lazy'}"
              decoding="async"
            />
          </li>`,
          )
          .join('')}
      </ul>
    </div>
  `;

  const sticky = section.querySelector<HTMLElement>('.hero-stack__sticky')!;
  const base = section.querySelector<HTMLElement>('.hero-stack__base')!;
  const shade = section.querySelector<HTMLElement>('.hero-stack__shade')!;
  const cardNodes = [...section.querySelectorAll<HTMLElement>('.hero-stack__card')];
  const cardImages = cardNodes.map((node) => node.querySelector('img')!);

  const steps = cards.length - 1;
  const stackCenter = (steps * STACK_OFFSET) / 2;

  let target = 0;
  let current = 0;
  let frame = 0;

  const render = (progress: number) => {
    const travel = sticky.clientHeight;
    const landed = cardNodes.map((_, i) =>
      i === 0 ? 1 : easeOut(clamp(progress * steps - (i - 1))),
    );

    cardNodes.forEach((node, i) => {
      const above = landed.slice(i + 1).reduce((sum, t) => sum + t, 0);
      const y = i * STACK_OFFSET - stackCenter + (1 - landed[i]) * travel;
      const scale = 1 - above * SCALE_STEP;

      node.style.transform = `translate3d(0, calc(-50% + ${y}px), 0) scale(${scale})`;
      node.style.filter = `brightness(${1 - Math.min(above, 3) * 0.12})`;
      cardImages[i].style.transform = `scale(${1.3 - landed[i] * 0.3})`;
    });

    base.style.transform = `scale(${1.08 - progress * 0.08})`;
    shade.style.opacity = String(progress * 0.45);
  };

  const tick = () => {
    current += (target - current) * EASING;
    if (Math.abs(target - current) < 0.0005) current = target;
    render(current);
    frame = current === target ? 0 : requestAnimationFrame(tick);
  };

  const update = () => {
    const scrollable = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top;
    target = scrollable > 0 ? clamp(-top / scrollable) : 0;

    if (reducedMotion.matches) {
      current = target;
      render(current);
    } else if (!frame) {
      frame = requestAnimationFrame(tick);
    }
  };

  const measure = () => {
    section.style.height = `${window.innerHeight * (1 + steps * SCROLL_PER_CARD)}px`;
    render(current);
    update();
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', measure);
  requestAnimationFrame(measure);

  return section;
}
