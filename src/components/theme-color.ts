/** The browser's own bars (Safari's address bar strip on phones) follow this colour. */
const meta = (): HTMLMetaElement => {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'theme-color';
    document.head.append(tag);
  }
  return tag;
};

/** Sets the bar colour while a layer is open; returns a function that puts the previous
 *  colour back. */
export function tintBrowserBar(color: string): () => void {
  const tag = meta();
  const previous = tag.content;
  tag.content = color;
  return () => {
    tag.content = previous;
  };
}
