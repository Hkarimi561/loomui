/** `embed/<slug>` resolved against `<base href>`, so it also works when the showcase is hosted under a sub-path (GitHub Pages). */
export function embedUrl(slug: string): string {
  return new URL('embed/' + slug, document.baseURI).pathname;
}

/** True when the page itself was loaded as `<base>/embed/<slug>`. */
export function isEmbedLocation(): boolean {
  const base = new URL(document.baseURI).pathname;
  return location.pathname.startsWith(base + 'embed/');
}
