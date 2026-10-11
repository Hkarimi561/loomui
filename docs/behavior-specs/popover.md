# Popover — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/popover`, demo trigger clicked (open: `data-side="left"`, `dir="rtl"` sample from the RTL demo). **[OUR-BUILD]** verified in the playground. Not done: live keyboard run on the original, source cross-check, closed-state animation capture.

## Structure [REA-DOM]
```
trigger: <button data-slot="popover-trigger" aria-haspopup="dialog" aria-expanded="true|false" aria-controls="<id>" data-state="open|closed">
content: <div role="dialog" id="<id>" data-side="…" data-align="center" data-state="open" data-slot="popover-content" tabindex="-1" dir="…"
         style="--radix-popover-content-transform-origin: var(--radix-popper-transform-origin); --radix-popover-trigger-width…; --…-available-width/height…">
  popover-header (flex flex-col gap-0.5 text-sm) > popover-title (font-medium) + popover-description (text-muted-foreground)
```
Note: `role="dialog"` **without** `aria-labelledby`/`aria-describedby` in the sample (title/description are not wired by Radix Popover).
Classes: `z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=…]:slide-in-from-… data-open:animate-in … data-closed:animate-out …`.
Default `side="bottom"`, `align="center"` (observed `data-align="center"`).

## Behavior
| | Result | Evidence |
|---|---|---|
| Open | click trigger; `aria-expanded` true, `data-state` open | REA-DOM |
| Focus on open | moves into content (first tabbable, else content) — Radix behavior | **UNKNOWN on original**; OUR-BUILD focuses first input |
| Esc / outside click | close, focus returns to trigger — Radix behavior | **UNKNOWN on original**; OUR-BUILD implemented |
| Focus trap / scroll lock | none (non-modal) | UNKNOWN on original; none implemented |
| Placement | below trigger, flips to opposite side on collision | OUR-BUILD (CDK flexible connected position) |
| CSS variables | `--radix-popover-content-transform-origin`, `-trigger-width/height`, `-available-width/height` | REA-DOM; set from our popper |

## Deviations
Content is always in the DOM (`hidden`) and moved into the overlay while open; no `PopoverAnchor` part; `aria-labelledby` not wired (matches original).

## UNKNOWN
Original's keyboard/focus on open and close; `collisionPadding`; arrow (none observed); RTL alignment of `start`/`end`.
