# Alert Dialog — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/alert-dialog.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Modal that interrupts the user and requires a response (Cancel/Action).

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `alert-dialog-trigger` | `button` | `data-variant=outline data-size=default type=button aria-haspopup=dialog aria-expanded=true\|false data-state=open\|closed` |
| `alert-dialog-overlay` | `div` | `data-state=open data-aria-hidden=true aria-hidden=true` |
| `alert-dialog-content` | `div` | `role=alertdialog data-state=open data-size=default dir=rtl data-lang=ar tabindex=-1` |
| `alert-dialog-header` | `div` | — |
| `alert-dialog-title` | `h2` | — |
| `alert-dialog-description` | `p` | — |
| `alert-dialog-footer` | `div` | — |
| `alert-dialog-cancel` | `button` | `type=button data-variant=outline data-size=default` |
| `alert-dialog-action` | `button` | `type=button data-variant=default data-size=default` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `role="alertdialog"`, modal (focus trapped, scroll locked, rest `aria-hidden`).
- Focus lands on **Cancel** when opened; backdrop click and — by Radix design — does not dismiss; Escape closes and returns focus to the trigger.

## Keyboard
| Keys | Result |
|---|---|
| Esc | Closes, focus returns to the trigger. |
| Tab / Shift+Tab | Cycles inside the dialog. |
| Enter / Space | Activates the focused button. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Built on the shared modal engine (`UiModalRoot`); content is declared inline and moved into the CDK overlay.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
