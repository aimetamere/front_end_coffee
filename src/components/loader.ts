import './loader.css';

/**
 * Once it shows, the loader stays at least this long, so it plays through a fold instead
 * of flashing, and the content arrives in one calm step.
 */
export const LOADER_MIN_MS = 1800;

/** The loader's markup: three boxes, announced to screen readers as `label`. */
export function loaderMarkup(label: string): string {
  return `
    <span class="loader" role="status" aria-label="${label}">
      <span class="loader__box loader__box--1"></span>
      <span class="loader__box loader__box--2"></span>
      <span class="loader__box loader__box--3"></span>
    </span>`;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Resolves once the loader shown at `shownAt` (performance.now()) has had its minimum time. */
export function loaderHeld(shownAt: number): Promise<void> {
  return wait(Math.max(0, LOADER_MIN_MS - (performance.now() - shownAt)));
}

/** Fades `host` out (it carries the .loader-host class), then resolves. */
export async function fadeOutLoader(host: HTMLElement): Promise<void> {
  host.classList.add('is-leaving');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) await wait(350);
}
