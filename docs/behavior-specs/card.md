# Card — behavior spec

Evidence: **[REA-DOM]** DOM of `ui.shadcn.com/docs/components/radix/card`. Not done: source cross-check, RTL, dark.

## Parts (all plain `<div>`, no ARIA) [REA-DOM]
| slot | key classes |
|---|---|
| `card` (`data-size="default"\|"sm"`) | `group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 data-[size=sm]:[--card-spacing:--spacing(3)]` |
| `card-header` | `grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-(--card-spacing)` |
| `card-title` | `text-base leading-snug font-medium group-data-[size=sm]/card:text-sm` (site adds `cn-font-heading`, omitted) |
| `card-description` | `text-sm text-muted-foreground` |
| `card-action` | `col-start-2 row-span-2 row-start-1 self-start justify-self-end` |
| `card-content` | `px-(--card-spacing)` |
| `card-footer` | `flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)` (demo adds `flex-col gap-2`) |

CSS variables: `--card`, `--card-foreground`, `--foreground` (ring), `--muted`, `--muted-foreground`, local `--card-spacing` (4 → 3 for `sm`).
Header collapses to a 2-column grid only when a `card-action` is present.

## Keyboard / ARIA
None. UNKNOWN: whether title should be a heading (original uses a div; we match).

## Deviations
Directives (`uiCard`, `uiCardHeader`, …) instead of components; `UI_CARD` array exports all parts.

## UNKNOWN
Image-first-child variants were not captured (classes copied, behavior untested); RTL/dark.
