# Tooltip — behavior spec

Evidence: **[LIVE]** built-in browser, real mouse hover on the first tooltip trigger, DOM read 2 s later. **[REA-DOM]** DOM capture of the closed state (an attempted focus-open via REA did not open it: trigger stayed `data-state="closed"`). **[OUR-BUILD]** playground. Not done: focus-open on the original, Esc/blur/click-to-close, source cross-check.

## Structure [LIVE]
```
trigger: <button data-slot="tooltip-trigger" data-state="closed|delayed-open"  (+ aria-describedby="<id>" while open — Radix)>
content: <div data-side="top" data-align="center" data-state="delayed-open" data-slot="tooltip-content" style="--radix-tooltip-content-transform-origin…">
           <p>Add to library</p>
           <span style="position:absolute; bottom:0; transform:translateY(100%); left:44px"><svg width="10" height="5" viewBox="0 0 30 10" …/></span>   ← arrow
         </div>
hidden:  <span id="<id>" role="tooltip" style="…visually hidden…"><p>Add to library</p></span>     ← assistive-tech copy
```
- Hover opens with `data-state="delayed-open"` (so a non-instant open path was taken). Closed trigger: `data-state="closed"` [REA-DOM]. Some triggers are wrapped (`<span class="inline-block w-fit" data-slot="tooltip-trigger">` for a disabled button) [REA-DOM].
- Content classes: `z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background … data-[state=delayed-open]:animate-in … data-closed:animate-out …`.
- Colors invert: `bg-foreground text-background`.

## Behavior
| | Result | Evidence |
|---|---|---|
| Hover opens | yes; shows as delayed-open | LIVE |
| Delay duration | UNKNOWN (opened within the 1–2 s wait); we default to 0 ms, `delay` input available | — |
| Focus opens (`instant-open`) | Radix behavior; UNKNOWN on original | — |
| Esc / pointerdown / blur / leave close | Radix behavior; UNKNOWN on original; implemented | OUR-BUILD |
| Hoverable content | Radix default (pointer may move onto content); implemented with 100 ms grace | OUR-BUILD |
| Role/ARIA | `role="tooltip"` span + trigger `aria-describedby` | LIVE (span), Radix (describedby) |

## Our implementation
`<div uiTooltip class="contents">` + `uiTooltipTrigger` + `uiTooltipContent`. Verified: hover on the "bottom" trigger → content in CDK container, `data-side="bottom"`, `data-state="delayed-open"`, trigger `aria-describedby` equals the `role="tooltip"` span id.

## Deviations
Arrow: a rotated square (original is a Radix SVG polygon whose classes were not captured) — not clearly visible in the playground screenshot. `delayDuration` default 0.

## UNKNOWN
Original delay and skip-delay window; arrow styling; focus/keyboard behavior; touch behavior; RTL.
