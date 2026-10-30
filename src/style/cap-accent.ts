import './cap-accent.css';

/**
 * Old Standard TT's "À" glyph sets the accent almost on the apex of the A.
 * Draws it ourselves with more room, while screen readers still read "À".
 */
export function capAccent(text: string): string {
  return text.replace(
    /À/g,
    '<span class="visually-hidden">À</span><span class="cap-grave" aria-hidden="true">A</span>',
  );
}
