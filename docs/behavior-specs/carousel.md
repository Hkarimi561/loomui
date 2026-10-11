# Carousel — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/carousel.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Embla-powered carousel: horizontal/vertical, loop/align options via `opts`, previous/next buttons and arrow-key navigation.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `carousel` | `div` | `role=region aria-roledescription=carousel dir=rtl` |
| `carousel-content` | `div` | — |
| `carousel-item` | `div` | `role=group aria-roledescription=slide` |
| `carousel-previous` | `button` | `data-variant=outline data-size=icon-sm disabled=""` |
| `carousel-next` | `button` | `data-variant=outline data-size=icon-sm` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Root `role="region" aria-roledescription="carousel"`; items `role="group" aria-roledescription="slide"`.
- Prev/Next are disabled at the ends (unless `loop`).
- Drag/swipe and inertia come from Embla.

## Keyboard
| Keys | Result |
|---|---|
| ArrowLeft / ArrowRight | Previous / next slide (mirrored in RTL); handled on the carousel root (verified with a key event). |
| Tab / Enter / Space | Reach and activate the prev/next buttons. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowLeft`, `ArrowRight`.

## Deviations
- Slide changes are not announced (no live region), same as shadcn.
- Autoplay is not bundled; pass an Embla plugin through `[plugins]`.

## Angular notes
`[opts]` (Embla options), `[plugins]`, `orientation`, `(ready)` emits the Embla API; `scrollPrev()/scrollNext()/scrollTo()` available via `exportAs="uiCarousel"`.

## UNKNOWN
- Behavior with `loop` and `dragFree` was not verified.
- Original keyboard handling target (root vs viewport).
