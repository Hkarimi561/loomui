import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { ELEMENT_ORIGIN } from './elements';

/** ARIA role a native tag provides implicitly; custom elements need it spelled out. */
const ROLE: Record<string, string> = {
  button: 'button',
  a: 'link',
  ul: 'list',
  ol: 'list',
  li: 'listitem',
  nav: 'navigation',
  fieldset: 'group',
  table: 'table',
  thead: 'rowgroup',
  tbody: 'rowgroup',
  tfoot: 'rowgroup',
  tr: 'row',
  th: 'columnheader',
  td: 'cell',
};

const DISPLAY: Record<string, string> = {
  table: 'table',
  thead: 'table-header-group',
  tbody: 'table-row-group',
  tfoot: 'table-footer-group',
  tr: 'table-row',
  th: 'table-cell',
  td: 'table-cell',
  caption: 'table-caption',
};

/** Titles that are headings in the documented markup (`<h2 uiDialogTitle>`): keep the heading role on the element. */
const HEADINGS = new Set(['ui-dialog-title', 'ui-sheet-title', 'ui-alert-dialog-title', 'ui-drawer-title']);

const INLINE_ORIGINS = new Set(['span', 'a', 'button', 'label', 'kbd']);

let styled = false;
/**
 * Custom elements are `display: inline` by default. These defaults sit in `@layer base`, so Tailwind utilities (flex, grid,
 * hidden, …) always win, and `:not([hidden])` keeps the `hidden` attribute working.
 */
function ensureDefaultStyles(): void {
  if (styled || typeof document === 'undefined') return;
  styled = true;
  const groups = new Map<string, string[]>();
  for (const [alias, origin] of Object.entries(ELEMENT_ORIGIN)) {
    const d = DISPLAY[origin] ?? (INLINE_ORIGINS.has(origin) ? 'inline-block' : 'block');
    (groups.get(d) ?? groups.set(d, []).get(d)!).push(alias);
  }
  const css =
    [...groups].map(([d, list]) => `:where(${list.join(',')}):not([hidden]){display:${d}}`).join('\n') +
    '\n:where([data-slot][disabled]:not(:is(button,input,select,textarea,fieldset,optgroup,option))){pointer-events:none;opacity:.5}';
  const style = document.createElement('style');
  style.setAttribute('data-loomui-elements', '');
  style.textContent = `@layer base{\n${css}\n}`;
  document.head.appendChild(style);
}

const isDisabled = (el: HTMLElement) => el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

/**
 * Applied (as a host directive) to every Loom UI directive that also has a custom-element selector, e.g. <ui-button>.
 * On native elements it does nothing. On a custom element it restores what the native tag provided for free:
 *  - the implicit ARIA role and, for buttons/links, a tab stop;
 *  - Enter / Space activation for button-like elements (Enter for links), skipped when the component already handled the key;
 *  - `href` navigation for link-like elements, `for` association for label-like elements.
 * Directives keep full control: anything they set themselves (role, tabindex, …) is never overwritten.
 */
@Directive()
export class UiElementHost {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const name = this.el.localName;
    const origin = ELEMENT_ORIGIN[name];
    if (origin === undefined) return; // native element or an element without a mapping
    ensureDefaultStyles();
    const destroy = inject(DestroyRef);

    afterNextRender(() => {
      const el = this.el;
      const role = ROLE[origin];
      if (role && !el.hasAttribute('role')) el.setAttribute('role', role);
      if ((origin === 'button' || origin === 'a') && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (HEADINGS.has(name) && !el.hasAttribute('role')) {
        el.setAttribute('role', 'heading');
        if (!el.hasAttribute('aria-level')) el.setAttribute('aria-level', '2');
      }

      const off: (() => void)[] = [];
      const on = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
        el.addEventListener(type, fn);
        off.push(() => el.removeEventListener(type, fn));
      };

      if (origin === 'button' || origin === 'a') {
        let spaceDown = false;
        on('keydown', (e) => {
          if (e.target !== el || e.defaultPrevented || isDisabled(el)) return;
          if (e.key === 'Enter') {
            e.preventDefault();
            el.click();
          } else if (e.key === ' ' && origin === 'button') {
            e.preventDefault(); // no page scroll; activate on keyup like a native button
            spaceDown = true;
          }
        });
        on('keyup', (e) => {
          if (e.key === ' ' && spaceDown && e.target === el && !isDisabled(el)) {
            spaceDown = false;
            el.click();
          }
        });
      }

      if (origin === 'a') {
        on('click', (e) => {
          const href = el.getAttribute('href');
          if (e.defaultPrevented || !href || isDisabled(el)) return;
          const target = el.getAttribute('target');
          if (target === '_blank') window.open(href, '_blank', 'noopener');
          else window.location.assign(href);
        });
      }

      if (origin === 'label') {
        on('click', (e) => {
          const id = el.getAttribute('for');
          if (!id || e.defaultPrevented) return;
          const t = e.target as HTMLElement;
          if (t.closest('button, input, select, textarea, a, [role=checkbox], [role=switch], [role=radio]')) return;
          const control = document.getElementById(id);
          if (!control) return;
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(control.tagName) && (control as HTMLInputElement).type !== 'checkbox' && (control as HTMLInputElement).type !== 'radio') control.focus();
          else control.click();
        });
      }

      destroy.onDestroy(() => off.forEach((f) => f()));
    });
  }
}
