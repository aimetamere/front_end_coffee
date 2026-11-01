/**
 * Arched wordmark for Café du Conservatoire.
 * The sweep matches logo-og.png: letters run from about −126° to 126°
 * around the circle (0° at the top), so the end letters tilt at the same angle.
 * The radius is the one that lets Old Standard TT sit on that sweep without
 * crowding. The face is the header link face, set in CSS.
 */
const VIEW_W = 1094;
const VIEW_H = 962;
const CX = 560;
const CY = 575;
const START_DEG = -126;
const END_DEG = 126;
const FILL = '#af845b';
const WORD = 'CAFÉ DU CONSERVATOIRE';
const FONT_SIZE = 132;
/** Advance width of WORD in Old Standard TT Bold at 100px, spaces included. */
const NATURAL_AT_100 = 1346;

const naturalWidth = NATURAL_AT_100 * (FONT_SIZE / 100);
const RADIUS = (naturalWidth * 360) / ((END_DEG - START_DEG) * 2 * Math.PI);

const point = (deg: number): [number, number] => {
  const rad = (deg * Math.PI) / 180;
  return [CX + RADIUS * Math.sin(rad), CY - RADIUS * Math.cos(rad)];
};

export function logoMark(className: string): string {
  const id = `logo-og-${className.replace(/[^a-z0-9]+/gi, '-')}`;
  const [x1, y1] = point(START_DEG);
  const [x2, y2] = point(END_DEG);
  const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${RADIUS.toFixed(1)} ${RADIUS.toFixed(1)} 0 1 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;

  return `<svg class="${className}" viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs><path id="${id}" d="${d}"/></defs><text fill="${FILL}" font-size="${FONT_SIZE}"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${WORD}</textPath></text></svg>`;
}
