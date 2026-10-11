# Input — behavior spec

Evidence: **[REA-DOM]** DOM of `ui.shadcn.com/docs/components/radix/input`. Not done: source cross-check, typed-interaction capture, RTL, dark.

## Structure [REA-DOM]
Native `<input data-slot="input" type=… class=…>`. No wrapper, no ARIA added (consumers add `aria-invalid`, `id`, labels). Observed types: text, password, file, email.

## Classes
`h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:… placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:…` (full string: `libs/ui/input/input.ts`).

## States
default · focus-visible (ring-3 + border-ring) · disabled (50% opacity, no pointer events) · `aria-invalid` (destructive border + ring). Text is 16px on mobile, 14px from `md:` (prevents iOS zoom).

## Keyboard
Native text-entry behavior only. UNKNOWN: nothing custom expected.

## Angular
Directive `input[uiInput]` on the native element, so `ngModel`, reactive forms and signal forms (`[field]`) work with no ControlValueAccessor.

## UNKNOWN
Textarea variant (separate shadcn component, not captured); RTL/dark rendering.
