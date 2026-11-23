import './page-transition.css';
import { LOADER_MIN_MS, loaderMarkup } from './loader';

/*
 * Phones only: a tap on a navigation link covers the screen with a white veil and the
 * loader while the next page (or the section of this page) renders behind it, then the
 * veil fades away. Across pages the veil is carried over: the old page fades it in, saves
 * the moment in sessionStorage, and the new page starts covered (an inline script in each
 * HTML head) and takes the loader on from the same point of its animation.
 *
 * The veil is a manual popover, so it sits above the open menu (both are in the top layer).
 */

const mobileQuery = window.matchMedia('(max-width: 768px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const STORAGE_KEY = 'page-veil';
const LINKS = '.bubble-menu__links a, .site-header__logo, .site-footer__nav a, .site-footer__mark, .site-footer__legal a';
/** The new page keeps the loader at least this long, even if the old one already played. */
const ARRIVAL_MIN_MS = 700;
/** Never stays covered longer than this, whatever happens. */
const MAX_COVER_MS = 8000;
const FADE_MS = 350;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const holds: Promise<unknown>[] = [];

let veil: HTMLElement | null = null;
/** Date.now() when the veil first showed, on this page or the one before. */
let shownAt = 0;

/** True while the page opened under the veil (so in-page loaders can skip their own hold). */
export function isPageVeiled(): boolean {
  return document.documentElement.classList.contains('is-veiled') || !!veil?.matches(':popover-open');
}

/** Keeps the arriving veil up until `promise` settles (e.g. the menu PDF's first page). */
export function holdPageVeil(promise: Promise<unknown>): void {
  holds.push(promise.catch(() => undefined));
}

const supported = () => typeof HTMLElement.prototype.showPopover === 'function';

function getVeil(): HTMLElement {
  if (veil) return veil;
  veil = document.createElement('div');
  veil.className = 'page-veil';
  veil.setAttribute('popover', 'manual');
  veil.innerHTML = loaderMarkup('Chargement de la page');
  document.body.append(veil);
  return veil;
}

/** Starts the loader's animation `elapsed` ms in, so it carries on across the page change. */
function syncLoader(element: HTMLElement, elapsed: number) {
  element.querySelectorAll<HTMLElement>('.loader__box').forEach((box) => {
    box.style.animationDelay = `${-elapsed}ms`;
  });
}

function showVeil(fade: boolean) {
  const element = getVeil();
  element.classList.toggle('is-instant', !fade);
  element.classList.remove('is-leaving');
  syncLoader(element, Date.now() - shownAt);
  if (!element.matches(':popover-open')) element.showPopover();
}

async function hideVeil() {
  const element = veil;
  if (!element?.matches(':popover-open')) return;
  element.classList.remove('is-instant');
  element.classList.add('is-leaving');
  if (!reducedMotion.matches) await wait(FADE_MS);
  if (element.classList.contains('is-leaving')) element.hidePopover();
}

const pageLoaded = () =>
  document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

/** A new page opened under the veil: keep it covered until it has rendered, then reveal. */
async function arrive() {
  const root = document.documentElement;
  if (!root.classList.contains('is-veiled')) return;
  let stored = 0;
  try {
    stored = Number(sessionStorage.getItem(STORAGE_KEY)) || 0;
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the veil still works, just without the carried-over timing.
  }
  if (!supported()) {
    root.classList.remove('is-veiled');
    return;
  }
  const now = Date.now();
  shownAt = stored && now - stored < MAX_COVER_MS ? stored : now;
  showVeil(false);
  root.classList.remove('is-veiled');

  const ready = (async () => {
    await pageLoaded();
    await Promise.all(holds);
    await document.fonts?.ready;
    // One painted frame of the finished page before it shows.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  })();
  const minimum = wait(Math.max(ARRIVAL_MIN_MS, LOADER_MIN_MS - (Date.now() - shownAt)));
  await Promise.race([Promise.all([ready, minimum]), wait(MAX_COVER_MS)]);
  await hideVeil();
}

function onClick(event: MouseEvent) {
  if (!mobileQuery.matches || !supported()) return;
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(LINKS);
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) return;

  const samePage = url.pathname === location.pathname;
  shownAt = Date.now();

  if (samePage && url.hash) {
    // A section of this page: the menu (or the browser) scrolls there behind the veil.
    showVeil(true);
    void wait(LOADER_MIN_MS).then(hideVeil);
    return;
  }

  // Another page (or this one again): fade the veil in, then go.
  event.preventDefault();
  showVeil(true);
  try {
    sessionStorage.setItem(STORAGE_KEY, String(shownAt));
  } catch {
    // Without storage the next page simply opens without the veil.
  }
  void wait(reducedMotion.matches ? 0 : 250).then(() => location.assign(url.href));
}

let mounted = false;

/** Wires the veil once per page (called from the shared header). */
export function mountPageTransition(): void {
  if (mounted) return;
  mounted = true;
  document.addEventListener('click', onClick, true);
  // Back to this page from the cache: the veil it left up must go.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && veil?.matches(':popover-open')) veil.hidePopover();
  });
  // The body exists once the module runs; arrive after the page's own components mounted.
  queueMicrotask(() => void arrive());
}
