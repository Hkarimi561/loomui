# Button — behavior spec

Evidence: **[REA-DOM]** = `capture_browser_scenario` DOM capture of `https://ui.shadcn.com/docs/components/radix/button` (Chromium 155, 1280×720, light). Class strings were extracted from every `[data-slot=button]` on the page.
Not done: source cross-check (`shadcn-ui/ui`), hover/active/focus computed-style capture, RTL, dark-mode capture.

## Structure
- Native `<button type="button" data-slot="button" data-variant data-size>` or `<a data-slot="button" …href>` [REA-DOM]. No wrapper and no ARIA role added; link-buttons keep `<a>` semantics. One sample link carried `role="link" tabindex="0"` (a site-level wrapper artifact, not part of Button) — ignored.
- Icon-only buttons carry a consumer-supplied `aria-label` (e.g. "Submit") [REA-DOM].
- No `data-state`. Open triggers (Dialog etc.) get `aria-expanded` / `aria-haspopup`; Button styles react via `aria-expanded:` classes [REA-DOM].

## Variants (default variant: `default`, default size: `default`)
`data-variant`: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` — all observed [REA-DOM].
`data-size`: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` — all observed [REA-DOM].

Full class strings live in `libs/ui/button/button-variants.ts`.

Heights: default `h-8`, xs `h-6`, lg `h-9`, icon `size-8`, icon-xs `size-6`, icon-sm `size-7`, icon-lg `size-9`.
**`sm` height is UNKNOWN**: every observed `sm` button also had an `h-*` override (`h-8`, `h-[31px]`), so the base `h-7` is inferred from the xs=6 / sm=7 / default=8 pattern.
`secondary` hover appeared as two different values on the page (`hover:bg-secondary/80` in one block, `color-mix(…5%)` on the default-size reference button). The `color-mix` version is used.

## States (class-level evidence only)
| State | Mechanism |
|---|---|
| hover | per-variant `hover:*` classes |
| focus-visible | `border-ring ring-3 ring-ring/50` (destructive: `border-destructive/40 ring-destructive/20`) |
| active | `translate-y-px` unless `aria-haspopup` is present |
| disabled | `disabled:pointer-events-none disabled:opacity-50` |
| invalid | `aria-invalid:border-destructive ring-destructive/20` |
| expanded | `aria-expanded:bg-muted text-foreground` (outline/ghost) |

## Keyboard / ARIA
Native only: Tab focuses; Enter and Space activate `<button>`; Enter activates `<a>`. Screen-reader output not exercised: UNKNOWN beyond native assumptions.

## CSS variables
`--primary(-foreground)`, `--secondary(-foreground)`, `--destructive`, `--muted`, `--foreground`, `--background`, `--border`, `--input`, `--ring`, `--radius-md`.

## Deviations
1. `pl-/pr-` → `ps-/pe-` for icon padding (RTL).
2. Directive instead of component; no `asChild` (use `<a uiButton>`).
3. The directive owns the whole `class` attribute.

## UNKNOWN
`sm` height; computed hover/active colors; RTL/dark rendering; source cross-check.
