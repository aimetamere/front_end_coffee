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
      <img class="hero-shape hero-shape--cream" src="/shapes/Shape5.png" alt="" aria-hidden="true" width="1000" height="1000" />
      <a class="hero-wordmark" href="#" aria-label="Café du Conservatoire, accueil">
        <svg class="hero-wordmark__svg" viewBox="${WORDMARK_VIEWBOX}" aria-hidden="true" focusable="false">
          <path id="hero-wordmark-path" class="hero-wordmark__path" d="${WORDMARK_PATH}" />
          <text class="hero-wordmark__measure">${WORDMARK_TEXT}</text>
          <text class="hero-wordmark__text"><textPath href="#hero-wordmark-path">${WORDMARK_TEXT}</textPath></text>
        </svg>
      </a>
      <span class="hero-stack__probe" aria-hidden="true"></span>
      <div class="hero-stack__photo">
        <div class="hero-stack__window">
          <img
            class="hero-stack__base"
            src="${building.src}"
            alt="${building.alt}"
            fetchpriority="high"
          />
        </div>
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
/** Phones: the wordmark is gone by this share of the growth, fading while the arch widens. */
const PHONE_FADE_END = 0.4;
/** Phones: once the finger lifts, a gesture that went (or is flung) past this share of the
 *  hero settles at the far end; anything less settles back where it started. */
const PHONE_SETTLE_THRESHOLD = 1 / 3;
/** Phones: how far the release speed carries the gesture (ms of travel at that speed). */
const PHONE_FLING_MS = 220;
/** Phones: finger travel, as a share of the screen height, that plays the whole hero. */
const PHONE_DRAG_SHARE = 0.6;
/** Phones: the settle ease takes this long for the whole hero (less for part of it). */
const PHONE_SETTLE_MS = 600;
const PHONE_SETTLE_MIN_MS = 300;

/** The arch grows to fill the pinned hero as the page scrolls through the runway.
 *
 *  Built to stay smooth on phones: nothing is laid out again while scrolling. The photo
 *  layer always covers the whole pinned frame; the arch is a clip-path on it (hero.css),
 *  and the image inside only moves and scales with a transform, so the browser never
 *  re-decodes or redraws it at a new size. Sizes are measured once (and again on resize);
 *  each frame only reads window.scrollY and writes three numbers. */
function mountArchGrowth(section: HTMLElement) {
  const sticky = section.querySelector<HTMLElement>('.hero-stack__sticky');
  const probe = section.querySelector<HTMLElement>('.hero-stack__probe');
  const image = section.querySelector<HTMLImageElement>('.hero-stack__base');
  if (!sticky || !probe || !image) return;

  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  let frame = 0;
  let active = false;

  // Measured geometry (CSS px).
  let sectionTop = 0; // section's top in the document
  let stickTop = 0; // where the frame pins: 0 on desktop, under the header on phones
  let runway = 0;
  let frameW = 0;
  let frameH = 0;
  let archW = 0;
  let ratio = 1313 / 860; // building.jpg, until the image reports its own size
  let imageW = 1;

  const measure = () => {
    const rect = section.getBoundingClientRect();
    if (!rect.height) return false;
    sectionTop = rect.top + window.scrollY;
    stickTop = parseFloat(getComputedStyle(sticky).top) || 0;
    runway = section.offsetHeight - sticky.offsetHeight;
    frameW = sticky.clientWidth;
    frameH = sticky.clientHeight;
    archW = probe.getBoundingClientRect().width;
    if (image.naturalWidth && image.naturalHeight) ratio = image.naturalWidth / image.naturalHeight;
    // The image is drawn once at the size that covers the full frame (the largest the arch
    // gets) and only scaled down from there.
    imageW = Math.max(frameW, frameH * ratio);
    section.style.setProperty('--img-w', `${imageW.toFixed(2)}px`);
    section.classList.add('is-measured');
    return true;
  };

  /** Draws the hero at `progress` (0 at rest, 1 grown to the full frame). */
  const apply = (progress: number) => {
    let fade: number;
    let grow: number;
    if (mobileQuery.matches) {
      // Phones: one motion. The letters fade out while the arch starts to widen.
      fade = clamp(progress / PHONE_FADE_END);
      grow = clamp(progress);
    } else {
      // The wordmark fades out first, with the arch at rest, so the growing photo never runs into the letters.
      fade = clamp(progress / FADE_SHARE);
      grow = clamp((progress - FADE_SHARE) / (1 - FADE_SHARE));
    }
    // Cover scale for the arch at this size (as object-fit: cover would give it).
    const archH = archW * 1.25;
    const boxW = archW + (frameW - archW) * grow;
    const boxH = archH + (frameH - archH) * grow;
    const scale = Math.max(boxW, boxH * ratio) / imageW;
    section.style.setProperty('--fade', fade.toFixed(4));
    section.style.setProperty('--grow', grow.toFixed(4));
    section.style.setProperty('--img-k', scale.toFixed(5));
  };

  /** Page scroll at which the hero shows `progress`. */
  const scrollFor = (progress: number) => sectionTop - stickTop + runway * progress;
  /** Progress from the page scroll, snapped to 0 or 1 within a hair (fractional scroll). */
  const progressNow = () => {
    if (runway <= 0) return 0;
    const progress = clamp((window.scrollY - scrollFor(0)) / runway);
    return progress < 0.002 ? 0 : progress > 0.998 ? 1 : progress;
  };

  /*
   * Phones: one gesture plays the whole hero, and the page leads it home.
   *
   * A touch that starts on the hero and moves into it (forward at rest, back when full-bleed,
   * either way mid-motion) is taken over on its first move: the browser never starts its own
   * scroll, so no momentum ever fights the motion. The finger drives the progress and the
   * page scroll together; on release the hero eases to 0 or 1 starting at the finger's own
   * speed, so there is no jolt when the finger lifts. A scroll the browser does own (one
   * that started below the hero and runs up into it) is stopped as it enters, and eased the
   * same way. The hero never rests between 0 and 1.
   */
  const phoneMode = () => mobileQuery.matches && !reducedMotion.matches && runway > 0;
  const pageLocked = () =>
    document.body.style.position === 'fixed' || document.documentElement.classList.contains('is-menu-open');

  type Settle = { from: number; to: number; slope: number; start: number; duration: number };
  let mode: 'idle' | 'pending' | 'drag' | 'native' | 'settle' = 'idle';
  let settle: Settle | null = null;
  let settledAt = 0; // the side the hero last came to rest on
  let shown = 0; // progress on screen
  let dragFrom = 0; // progress when the drag took over
  let dragTo = 0; // progress the finger asks for
  let startX = 0;
  let startY = 0;
  let resumeTo: number | null = null; // a settle a touch interrupted, resumed if the touch is only a tap
  let samples: { p: number; t: number }[] = []; // recent drag progress, for the release speed
  let lastScrollY = 0;
  let lastScrollT = 0;
  let scrollSpeed = 0; // native scroll, progress per ms, positive opening
  let momentumStopped = false;

  const stopMomentum = () => {
    if (momentumStopped) return;
    momentumStopped = true;
    document.documentElement.style.overflow = 'hidden';
  };
  const releaseMomentum = () => {
    if (!momentumStopped) return;
    momentumStopped = false;
    if (!pageLocked()) document.documentElement.style.overflow = '';
  };

  /** Eases from what is on screen to `to`, leaving at `speed` (progress per ms) when it
   *  points the same way, never overshooting. */
  const settleTo = (to: number, speed: number) => {
    const from = shown;
    const distance = to - from;
    settledAt = to;
    if (Math.abs(distance) < 0.001) {
      settle = null;
      mode = 'idle';
      shown = to;
      window.scrollTo(0, scrollFor(to));
      apply(to);
      releaseMomentum();
      return;
    }
    let duration = Math.max(PHONE_SETTLE_MIN_MS, PHONE_SETTLE_MS * Math.sqrt(Math.abs(distance)));
    let slope = Math.sign(speed) === Math.sign(distance) ? speed * duration : 0;
    // A fast release finishes sooner, so the ease still leaves at the finger's speed.
    if (Math.abs(slope) > 3 * Math.abs(distance)) {
      duration = Math.max(PHONE_SETTLE_MIN_MS, (3 * Math.abs(distance)) / Math.abs(speed));
      slope = Math.sign(distance) * Math.min(Math.abs(speed) * duration, 3 * Math.abs(distance));
    }
    settle = { from, to, slope, start: performance.now(), duration };
    mode = 'settle';
    schedule();
  };

  /** Where a release lands: past the threshold from the side it started on, the other side. */
  const landing = (progress: number, speed: number, startSide: number) => {
    const flung = progress + speed * PHONE_FLING_MS;
    return startSide === 0 ? (flung > PHONE_SETTLE_THRESHOLD ? 1 : 0) : 1 - flung > PHONE_SETTLE_THRESHOLD ? 0 : 1;
  };

  const paint = () => {
    frame = 0;
    if (reducedMotion.matches || runway <= 0) {
      settle = null;
      mode = 'idle';
      shown = 0;
      apply(0);
      return;
    }
    if (mode === 'settle' && settle) {
      const { from, to, slope, start, duration } = settle;
      const t = clamp((performance.now() - start) / duration);
      // Cubic Hermite: leaves at `slope`, arrives at rest, stays between from and to.
      shown = from + (to - from) * (3 * t * t - 2 * t * t * t) + slope * (t * t * t - 2 * t * t + t);
      if (t >= 1) shown = to;
      window.scrollTo(0, scrollFor(shown));
      apply(shown);
      if (t < 1) {
        schedule();
      } else {
        settle = null;
        mode = 'idle';
        releaseMomentum();
      }
      return;
    }
    if (mode === 'drag') {
      shown = dragTo;
      window.scrollTo(0, scrollFor(shown));
      apply(shown);
      return;
    }
    shown = progressNow();
    apply(shown);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  const onScroll = () => {
    // The drag and the settle move the page themselves.
    if (mode === 'drag' || mode === 'settle') return;
    const now = performance.now();
    const dt = now - lastScrollT;
    if (dt > 0 && dt < 100 && runway > 0) scrollSpeed = (window.scrollY - lastScrollY) / runway / dt;
    else scrollSpeed = 0;
    lastScrollY = window.scrollY;
    lastScrollT = now;
    if (!active) return;
    schedule();
    if (!phoneMode() || pageLocked() || mode === 'native' || mode === 'pending') return;
    // No finger down, yet the page is inside the hero (momentum running in from below, or the
    // keyboard): stop it there and lead it home in the direction it was going.
    const progress = progressNow();
    if (progress > 0 && progress < 1) {
      stopMomentum();
      shown = progress;
      settleTo(scrollSpeed < 0 ? 0 : scrollSpeed > 0 ? 1 : settledAt, scrollSpeed);
    }
  };

  window.addEventListener(
    'touchstart',
    (event) => {
      if (!phoneMode() || pageLocked() || event.touches.length > 1) {
        if (mode === 'pending' || mode === 'drag') mode = 'idle';
        return;
      }
      releaseMomentum();
      resumeTo = null;
      if (mode === 'settle') {
        // A new finger takes over a running settle where it is.
        resumeTo = settle?.to ?? null;
        settle = null;
      } else {
        shown = progressNow();
      }
      mode = 'pending';
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    'touchmove',
    (event) => {
      if (mode !== 'pending' && mode !== 'drag') return;
      const touch = event.touches[0];
      if (mode === 'pending') {
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (!dy || Math.abs(dx) > Math.abs(dy)) return;
        const forward = dy < 0; // finger up, page forward, hero opening
        const midway = shown > 0 && shown < 1;
        const atRest = shown === 0 && window.scrollY <= scrollFor(0) + 2;
        const atFull = shown === 1 && Math.abs(window.scrollY - scrollFor(1)) <= 2;
        if (!event.cancelable || !(midway || (atRest && forward) || (atFull && !forward))) {
          // The browser scrolls this one (the page above the hero, or on into the next section).
          mode = 'native';
          return;
        }
        mode = 'drag';
        dragFrom = shown;
        dragTo = shown;
        startY = touch.clientY;
        samples = [{ p: shown, t: event.timeStamp }];
      }
      if (event.cancelable) event.preventDefault();
      const travel = window.innerHeight * PHONE_DRAG_SHARE;
      dragTo = clamp(dragFrom + (startY - touch.clientY) / travel);
      samples.push({ p: dragTo, t: event.timeStamp });
      while (samples.length > 2 && event.timeStamp - samples[0].t > 100) samples.shift();
      schedule();
    },
    { passive: false },
  );

  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length) return;
    const was = mode;
    if (was === 'drag') {
      const first = samples[0];
      const last = samples[samples.length - 1];
      const age = event.timeStamp - last.t;
      // A finger held still before lifting has no speed left.
      const speed = last.t > first.t && age < 80 ? (last.p - first.p) / (last.t - first.t) : 0;
      shown = dragTo;
      settleTo(landing(dragTo, speed, Math.round(dragFrom)), speed);
    } else if (was === 'pending') {
      // A tap: a settle it interrupted carries on.
      if (resumeTo !== null) settleTo(resumeTo, 0);
      else mode = 'idle';
    } else if (was === 'native') {
      mode = 'idle';
      const progress = progressNow();
      if (phoneMode() && progress > 0 && progress < 1) {
        // Dragged up into the hero from below: stop the momentum and lead it home.
        stopMomentum();
        shown = progress;
        settleTo(landing(progress, scrollSpeed, 1), scrollSpeed);
      }
    }
    resumeTo = null;
  };
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

  const remeasure = () => {
    if (measure()) schedule();
  };

  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    // Also runs on the way out, so a fast scroll past the hero still lands on 0 or 1.
    schedule();
  }).observe(section);

  // Sizes change with the window, the toolbar-independent svh frame, fonts and the image.
  new ResizeObserver(remeasure).observe(sticky);
  new ResizeObserver(remeasure).observe(section);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', remeasure);
  window.addEventListener('load', remeasure);
  image.addEventListener('load', remeasure);
  document.fonts?.ready.then(remeasure);
  mobileQuery.addEventListener('change', remeasure);
  reducedMotion.addEventListener('change', schedule);
  requestAnimationFrame(remeasure);
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
