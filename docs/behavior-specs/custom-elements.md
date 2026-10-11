# Custom elements — behavior spec

Evidence: **[OWN]** this is our addition, not part of shadcn/ui, so there is no live original to capture. Behavior below is what the implementation does and what was verified in a real browser (Chrome engine, real key presses where noted). Not verified: screen readers, Firefox/Safari.

## Summary
Every directive also exists as a custom element: `[uiDialogContent]` → `<ui-dialog-content>`. The directive selectors are unchanged. 286 aliases are generated (`tools/add-elements.mjs`, map in `libs/ui/utils/elements.ts`); custom elements require a hyphen, which is why it is `<ui-button>` and not `<Button>` (which would be the native element).

## How it works
- **Alias selector.** The element name is added to the existing selector (`'button[uiButton], a[uiButton], ui-button'`), so the directive/component is instantiated *on the element itself*. Dependency injection, content queries (`contentChildren`), `exportAs` and inputs/outputs are identical to the directive form.
- **`UiElementHost`** (host directive on every aliased class). On native tags it does nothing. On a custom element it restores what the native tag provided: implicit ARIA `role` (button, link, list, listitem, navigation, group, table/row/cell…, heading for dialog-like titles), a tab stop for button/link-like elements, Enter/Space activation (Enter for links), `href` navigation for link-like elements, `for` association for label-like elements. It never overwrites a role/tabindex the directive sets itself.
- **Default display.** Custom elements are `display:inline`; defaults (block / inline-block / table-*) are injected once into `@layer base`, so Tailwind utilities win and the `hidden` attribute still hides.
- **Wrappers** for native controls that cannot be custom elements: `<ui-input>`, `<ui-textarea>`, `<ui-native-select>`, `<ui-input-group-control>`, `<ui-avatar-image>`, `<ui-command-input>`, `<ui-combobox-input>`. A real `<input>`/`<textarea>`/`<select>`/`<img>` lives inside; `ngModel` / reactive forms work (ControlValueAccessor); `aria-label`/`aria-describedby` and `id` go to the inner control (the host gets no `id`, so `<label for>` finds the real control).
- **`disabled`.** Button-like directives got a real `disabled` input that is reflected as the `disabled` attribute (`<ui-button [disabled]="x">`); custom elements with `[disabled]` get `pointer-events:none; opacity:.5` (a custom element has no `:disabled` pseudo-class) and are skipped by keyboard activation.
- **Icons.** `[&>svg]` / `has-[>svg]` class tokens got `ui-icon` twins so `<ui-icon>` inside alerts, badges, etc. lays out the same as an `<svg>`.

## Keyboard (restored on the element)
| Keys | Result |
|---|---|
| Tab / Shift+Tab | Button-like and link-like elements are tab stops (`tabindex=0`) unless the component manages roving tabindex itself. |
| Enter | Clicks a focused button-like/link-like element (skipped if the component already handled the key). |
| Space | Clicks on key-up for button-like elements; no page scroll. |
| All component-specific keys | Unchanged (tabs arrows, menu arrows/typeahead, select, dialog Esc, …). |

## Known deviations / limits
- `<ui-button>` is **not** a form submit button: a custom element cannot be associated with a `<form>`. Use `(click)` handlers. `<ui-questionnaire>` is a `<form>` in directive form; as an element it has no native `submit` event (Enter/Ctrl+Enter keys and `submit()` still work).
- A `<select>` only accepts `<option>`/`<optgroup>`: inside `<ui-native-select>` options stay native elements (no option custom elements).
- Heading roles are only added for `ui-dialog-title`, `ui-sheet-title`, `ui-alert-dialog-title`, `ui-drawer-title` (those are `<h2>` in the documented markup).
- Unknown/typo'd element names are caught at compile time by Angular (NG8001); unknown *attributes* on custom elements are not.
- Screen-reader announcements for custom elements are UNVERIFIED.

## UNKNOWN
Screen-reader output; behavior in Firefox/Safari; interaction with `<fieldset disabled>`; text selection quirks for `display:table-*` custom elements.
