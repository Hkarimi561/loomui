# Slider — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/slider.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
One or more thumbs on a track (`role="slider"`), horizontal/vertical, min/max/step.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `slider` | `span` | `dir=ltr\|rtl data-orientation=horizontal\|vertical aria-disabled=false\|true data-disabled=""` |
| `slider-track` | `span` | `data-orientation=horizontal\|vertical data-disabled=""` |
| `slider-range` | `span` | `data-orientation=horizontal\|vertical data-disabled=""` |
| `slider-thumb` | `span` | `role=slider aria-valuemin=0 aria-valuemax=100\|1 aria-orientation=horizontal\|vertical data-orientation=horizontal\|vertical tabindex=0 data-radix-collection-item="" aria-valuenow=75\|25\|50\|10 aria-label=Minimum\|Maximum\|Value 1 of 3\|Value 2 of 3 data-disabled=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Pointer: click the track moves the nearest thumb; drag with pointer capture.
- Thumb exposes `aria-valuemin/max/now`, `aria-orientation`.

## Keyboard
| Keys | Result |
|---|---|
| ArrowRight / ArrowUp | +step (mirrored in RTL horizontally). |
| ArrowLeft / ArrowDown | −step. |
| PageUp / PageDown | ±10 steps. |
| Home / End | Min / max. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Multi-thumb crossing rules vs Radix (min steps between thumbs).
