import EmblaCarousel, { type EmblaOptionsType } from 'embla-carousel';
import './carousel.css';

export type Slide = {
  src: string;
  alt: string;
};

const chevronLeft = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>`;

const chevronRight = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>`;

export function createCarousel(
  slides: Slide[],
  options: EmblaOptionsType = { loop: false },
): HTMLElement {
  const root = document.createElement('section');
  root.className = 'carousel';
  root.setAttribute('aria-roledescription', 'carousel');
  root.setAttribute('aria-label', 'Photos du café');

  root.innerHTML = `
    <div class="carousel__viewport">
      <div class="carousel__container">
        ${slides
          .map(
            (slide, i) => `
          <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} sur ${slides.length}">
            <img
              src="${slide.src}"
              alt="${slide.alt}"
              loading="${i === 0 ? 'eager' : 'lazy'}"
              decoding="async"
            />
          </div>`,
          )
          .join('')}
      </div>
    </div>
    <button type="button" class="carousel__button carousel__button--prev" aria-label="Photo précédente">${chevronLeft}</button>
    <button type="button" class="carousel__button carousel__button--next" aria-label="Photo suivante">${chevronRight}</button>
    <div class="carousel__dots"></div>
  `;

  const viewport = root.querySelector<HTMLElement>('.carousel__viewport')!;
  const prevButton = root.querySelector<HTMLButtonElement>('.carousel__button--prev')!;
  const nextButton = root.querySelector<HTMLButtonElement>('.carousel__button--next')!;
  const dotsNode = root.querySelector<HTMLElement>('.carousel__dots')!;

  const embla = EmblaCarousel(viewport, options);

  prevButton.addEventListener('click', () => embla.scrollPrev());
  nextButton.addEventListener('click', () => embla.scrollNext());

  const renderDots = () => {
    dotsNode.innerHTML = embla
      .scrollSnapList()
      .map(
        (_, i) =>
          `<button type="button" class="carousel__dot" aria-label="Aller à la photo ${i + 1}"></button>`,
      )
      .join('');
    dotsNode.querySelectorAll<HTMLButtonElement>('.carousel__dot').forEach((dot, i) => {
      dot.addEventListener('click', () => embla.scrollTo(i));
    });
  };

  const updateState = () => {
    prevButton.disabled = !embla.canScrollPrev();
    nextButton.disabled = !embla.canScrollNext();

    const selected = embla.selectedScrollSnap();
    dotsNode.querySelectorAll<HTMLButtonElement>('.carousel__dot').forEach((dot, i) => {
      const isSelected = i === selected;
      dot.classList.toggle('carousel__dot--selected', isSelected);
      if (isSelected) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  embla.on('reInit', renderDots).on('reInit', updateState).on('select', updateState);

  renderDots();
  updateState();

  return root;
}
