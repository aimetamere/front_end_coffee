import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import './hero.css';
// import { createStackingPhotos } from './stacking-photos';

const building = {
  src: '/building.jpg',
  alt: 'La façade du Conservatoire de musique de Genève',
};

const interior = {
  src: '/interior.jpg',
  alt: 'La salle du café, avec ses tables, ses chaises rouges et bleues et ses suspensions lumineuses',
};

/** How long each photo stays before the loader sends the next one. */
const SLIDE_MS = 5200;
const mobileQuery = window.matchMedia('(max-width: 768px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// /** Scroll distance per stacking photo, as a fraction of the viewport height. */
// const SCROLL_PER_CARD = 0.8;
// /** How quickly the cards catch the scroll, per frame at 60fps. */
// const EASING = 0.18;
//
// const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// const mobileQuery = window.matchMedia('(max-width: 768px)');
// const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function createHero(): HTMLElement {
  // const stacking = createStackingPhotos();
  const section = document.createElement('section');
  section.className = 'hero-stack';
  section.setAttribute('aria-label', 'Découvrir le café');

  section.innerHTML = `
    <div class="hero-stack__sticky">
      <div class="hero-stack__photo">
        <img
          class="hero-stack__base"
          src="${building.src}"
          alt="${building.alt}"
          fetchpriority="high"
        />
        <div class="hero-carousel" aria-roledescription="carousel" aria-label="Le café">
          <div class="hero-carousel__viewport">
            <div class="hero-carousel__container">
              <div class="hero-carousel__slide" role="group" aria-roledescription="slide" aria-label="1 sur 2">
                <img
                  class="hero-carousel__image hero-carousel__image--building"
                  src="${building.src}"
                  alt="${building.alt}"
                  fetchpriority="high"
                />
              </div>
              <div class="hero-carousel__slide" role="group" aria-roledescription="slide" aria-label="2 sur 2" aria-hidden="true">
                <img
                  class="hero-carousel__image hero-carousel__image--interior"
                  src="${interior.src}"
                  alt="${interior.alt}"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
          <div class="hero-carousel__loader" aria-hidden="true">
            <span class="hero-carousel__loader-bar"></span>
          </div>
        </div>
      </div>
    </div>
  `;

  // section.querySelector('.hero-stack__sticky')!.append(stacking.element);
  //
  // const sticky = section.querySelector<HTMLElement>('.hero-stack__sticky')!;
  // const steps = stacking.count - 1;
  //
  // let target = 0;
  // let current = 0;
  // let frame = 0;
  // let last = 0;
  // let scrollable = 0;
  // let stickTop = 0;
  //
  // const render = (progress: number) => {
  //   stacking.render(progress, sticky.clientHeight);
  // };
  //
  // const tick = (now: number) => {
  //   const delta = last ? Math.min(now - last, 34) : 16.7;
  //   last = now;
  //   // Same catch-up speed when the phone paints fewer frames, so the motion doesn't stutter.
  //   const step = 1 - (1 - EASING) ** (delta / 16.7);
  //   current += (target - current) * step;
  //   if (Math.abs(target - current) < 0.0005) current = target;
  //   render(current);
  //   frame = current === target ? 0 : requestAnimationFrame(tick);
  // };
  //
  // const update = () => {
  //   const top = section.getBoundingClientRect().top;
  //   target = scrollable > 0 ? clamp((stickTop - top) / scrollable) : 0;
  //
  //   // Touch scrolling is already smoothed. A second delay makes the page feel like it lags the finger.
  //   if (reducedMotion.matches || mobileQuery.matches) {
  //     current = target;
  //     render(current);
  //     return;
  //   }
  //
  //   if (!frame) {
  //     last = 0;
  //     frame = requestAnimationFrame(tick);
  //   }
  // };
  //
  // const measure = () => {
  //   if (mobileQuery.matches) {
  //     const pin = sticky.clientHeight;
  //     section.style.height = `calc(${pin}px + 100svh * ${steps * SCROLL_PER_CARD})`;
  //   } else {
  //     section.style.height = `calc(100dvh * ${1 + steps * SCROLL_PER_CARD})`;
  //   }
  //   scrollable = Math.max(0, section.offsetHeight - sticky.clientHeight);
  //   stickTop = mobileQuery.matches ? parseFloat(getComputedStyle(sticky).top) || 0 : 0;
  //   update();
  // };
  //
  // // Off screen, the hero does no scroll work and releases its GPU layers.
  // let active = false;
  // new IntersectionObserver(([entry]) => {
  //   active = entry.isIntersecting;
  //   section.classList.toggle('is-active', active);
  //   update();
  // }).observe(section);
  //
  // window.addEventListener('scroll', () => active && update(), { passive: true });
  // window.addEventListener('resize', measure);
  // requestAnimationFrame(measure);

  mountMobileCarousel(section);

  return section;
}

/** Mobile only: the arch photo loops, and a thin bar fills until the next picture. */
function mountMobileCarousel(section: HTMLElement) {
  const viewport = section.querySelector<HTMLElement>('.hero-carousel__viewport');
  const bar = section.querySelector<HTMLElement>('.hero-carousel__loader-bar');
  const slides = [...section.querySelectorAll<HTMLElement>('.hero-carousel__slide')];
  if (!viewport || !bar) return;

  let embla: EmblaCarouselType | null = null;
  let raf = 0;
  let elapsed = 0;
  let last = 0;
  let playing = false;
  let dragging = false;
  let inView = true;

  const paint = (progress: number) => {
    bar.style.transform = `scaleX(${progress})`;
  };

  const tick = (now: number) => {
    if (!playing) return;
    if (!last) last = now;
    const delta = Math.min(now - last, 80);
    last = now;

    const hold =
      dragging ||
      document.hidden ||
      document.documentElement.classList.contains('is-menu-open');

    if (!hold && embla) {
      elapsed += delta;
      const progress = Math.min(1, elapsed / SLIDE_MS);
      paint(progress);
      if (progress >= 1) {
        elapsed = 0;
        paint(0);
        embla.scrollNext();
      }
    }

    raf = requestAnimationFrame(tick);
  };

  const play = () => {
    if (playing || reducedMotion.matches || !embla) return;
    playing = true;
    last = 0;
    raf = requestAnimationFrame(tick);
  };

  const pause = () => {
    playing = false;
    last = 0;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const markSlide = () => {
    if (!embla) return;
    const selected = embla.selectedScrollSnap();
    slides.forEach((slide, i) => {
      slide.toggleAttribute('aria-hidden', i !== selected);
    });
  };

  const start = () => {
    if (embla || !mobileQuery.matches) return;
    embla = EmblaCarousel(viewport, { loop: true, align: 'start', duration: 32 });
    embla.on('select', markSlide);
    embla.on('pointerDown', () => {
      dragging = true;
    });
    embla.on('pointerUp', () => {
      dragging = false;
      elapsed = 0;
      paint(0);
    });
    markSlide();
    if (inView) play();
  };

  const stop = () => {
    pause();
    embla?.destroy();
    embla = null;
    elapsed = 0;
    paint(0);
  };

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) play();
    else pause();
  }).observe(section);

  mobileQuery.addEventListener('change', () => {
    if (mobileQuery.matches) start();
    else stop();
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) pause();
    else if (inView) play();
  });

  document.addEventListener('visibilitychange', () => {
    last = 0;
  });

  window.addEventListener('resize', () => embla?.reInit());

  start();
}
