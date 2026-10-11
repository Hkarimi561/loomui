let uidCounter = 0;
/** Unique, stable-per-session id like `ui-dialog-3`. */
export const nextId = (prefix: string): string => `${prefix}-${uidCounter++}`;

/**
 * Radix (via `aria-hidden`) hides everything outside a modal layer from assistive tech.
 * Marks every <body> child except the CDK overlay container with aria-hidden + data-aria-hidden,
 * and returns a function that restores the previous state.
 */
export function hideOthers(keep: Element): () => void {
  const changed: { el: Element; prev: string | null }[] = [];
  for (const el of Array.from(document.body.children)) {
    if (el === keep || el.contains(keep) || el.tagName === 'SCRIPT') continue;
    changed.push({ el, prev: el.getAttribute('aria-hidden') });
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-aria-hidden', 'true');
  }
  return () => {
    for (const { el, prev } of changed) {
      el.removeAttribute('data-aria-hidden');
      if (prev === null) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', prev);
    }
  };
}

/**
 * Resolves when the element's CSS animations (tw-animate-css `animate-out`) have finished, or after a
 * fallback timeout so we never keep an overlay mounted forever (reduced motion, no animation, hidden tab).
 */
export function whenAnimationDone(el: HTMLElement | null, fallbackMs = 250): Promise<void> {
  return new Promise((resolve) => {
    if (!el) return resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('animationend', onEnd);
      el.removeEventListener('animationcancel', onEnd);
      clearTimeout(timer);
      resolve();
    };
    const onEnd = (e: Event) => {
      if (e.target === el) finish();
    };
    el.addEventListener('animationend', onEnd);
    el.addEventListener('animationcancel', onEnd);
    const timer = setTimeout(finish, fallbackMs);
    const running = typeof el.getAnimations === 'function' ? el.getAnimations().length : 0;
    if (!running) finish();
  });
}
