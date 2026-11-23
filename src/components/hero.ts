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

/*
 * Desktop wordmark geometry, in units where the arch photo is 100 wide and 125 tall
 * (x 0–100, y 0–125, flat base on y = 125). The photo's half-circle has its centre at (50, 50).
 * The hairline sits ARCH_GAP outside the photo (matches --arch-gap in hero.css), and the
 * letters' baseline sits TEXT_GAP outside the hairline. The SVG is sized from --arch-w,
 * so the arch and the wordmark always scale together.
 */
const ARCH_GAP = 1.5;
const TEXT_GAP = 4;
const WORDMARK_R = 50 + ARCH_GAP + TEXT_GAP;
/** Path ends on the photo's flat base, which is the bottom of the screen. */
const WORDMARK_BASE = 125;
// Lower left → up the left side → over the top → down the right side. Letters stand outward.
const WORDMARK_PATH = `M ${50 - WORDMARK_R} ${WORDMARK_BASE} V 50 A ${WORDMARK_R} ${WORDMARK_R} 0 0 1 ${50 + WORDMARK_R} 50 V ${WORDMARK_BASE}`;
const WORDMARK_VIEWBOX = '-30 -30 160 155';
const WORDMARK_TEXT = 'CAFÉ DU CONSERVATOIRE';

/** The mobile photo carousel (kept, not shown). Turn back on together with its CSS. */
const SHOW_CAROUSEL = false;

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
      <img class="hero-shape hero-shape--left" src="/shapes/Shape7.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <img class="hero-shape hero-shape--blue" src="/shapes/Shape9.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <img class="hero-shape hero-shape--arch" src="/shapes/Shape10.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <img class="hero-shape hero-shape--dot" src="/shapes/Shape8.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <a class="hero-wordmark" href="#" aria-label="Café du Conservatoire, accueil">
        <svg class="hero-wordmark__svg" viewBox="${WORDMARK_VIEWBOX}" aria-hidden="true" focusable="false">
          <path id="hero-wordmark-path" class="hero-wordmark__path" d="${WORDMARK_PATH}" />
          <text class="hero-wordmark__measure">${WORDMARK_TEXT}</text>
          <text class="hero-wordmark__text"><textPath href="#hero-wordmark-path">${WORDMARK_TEXT}</textPath></text>
        </svg>
      </a>
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

  // The looping carousel is hidden for now: phones show the same arch as desktop.
  if (SHOW_CAROUSEL) mountMobileCarousel(section);
  fitWordmark(section);
  mountArchGrowth(section);

  return section;
}

/** Share of the runway spent fading the wordmark before the arch starts to grow. */
const FADE_SHARE = 0.15;

/** The arch grows to fill the pinned hero as the page scrolls through the runway. */
function mountArchGrowth(section: HTMLElement) {
  const sticky = section.querySelector<HTMLElement>('.hero-stack__sticky');
  if (!sticky) return;

  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  let frame = 0;
  let active = false;

  const update = () => {
    frame = 0;
    if (reducedMotion.matches) {
      section.style.removeProperty('--grow');
      section.style.removeProperty('--fade');
      return;
    }
    // The frame pins at its sticky top: 0 on desktop, under the header on phones.
    const stickTop = parseFloat(getComputedStyle(sticky).top) || 0;
    const runway = section.offsetHeight - sticky.offsetHeight;
    const progress = runway > 0 ? clamp((stickTop - section.getBoundingClientRect().top) / runway) : 0;
    // The wordmark fades out first, with the arch at rest, so the growing photo never runs into the letters.
    section.style.setProperty('--fade', clamp(progress / FADE_SHARE).toFixed(4));
    section.style.setProperty('--grow', clamp((progress - FADE_SHARE) / (1 - FADE_SHARE)).toFixed(4));
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    // Also runs on the way out, so a fast scroll past the hero still lands on 0 or 1.
    schedule();
  }).observe(section);

  window.addEventListener('scroll', () => active && schedule(), { passive: true });
  window.addEventListener('resize', schedule);
  mobileQuery.addEventListener('change', schedule);
  reducedMotion.addEventListener('change', schedule);
  schedule();
}

/** Spreads the letters evenly so the phrase runs the whole arch path, end to end. */
function fitWordmark(section: HTMLElement) {
  const path = section.querySelector<SVGPathElement>('.hero-wordmark__path');
  const measure = section.querySelector<SVGTextElement>('.hero-wordmark__measure');
  const text = section.querySelector<SVGTextElement>('.hero-wordmark__text');
  const textPath = text?.querySelector('textPath');
  if (!path || !measure || !text || !textPath) return;

  const fit = () => {
    const natural = measure.getComputedTextLength();
    if (!natural) return;
    const chars = [...WORDMARK_TEXT].length;
    const spacing = Math.max(0, (path.getTotalLength() - natural) / chars);
    text.style.letterSpacing = `${spacing}px`;
    // letter-spacing also follows the last letter. Half of it at the start keeps the phrase centred.
    textPath.setAttribute('startOffset', `${spacing / 2}`);
  };

  fit();
  document.fonts?.ready.then(fit);
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
