# Accordion — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/accordion.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Vertically stacked collapsible sections. `type="single"` (optionally `collapsible`) or `type="multiple"`.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `accordion` | `div` | `data-orientation=vertical` |
| `accordion-item` | `div` | `data-state=open\|closed data-orientation=vertical data-disabled=""` |
| `accordion-trigger` | `button` | `type=button aria-expanded=true\|false data-state=open\|closed data-orientation=vertical data-radix-collection-item="" data-disabled="" disabled=""` |
| `accordion-trigger-icon` | `svg` | `xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round` |
| `accordion-content` | `div` | `data-state=open\|closed role=region data-orientation=vertical hidden="" data-disabled=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Trigger is a button with `aria-expanded`, `aria-controls`; content is `role="region"` labelled by the trigger, with `data-state` open/closed and height animation (`--radix-accordion-content-height` equivalent).
- Disabled items skip keyboard navigation.

## Keyboard
| Keys | Result |
|---|---|
| Enter / Space | Toggles the focused item. |
| ArrowDown / ArrowUp | Moves focus to the next/previous trigger (wraps). |
| Home / End | Focus first / last trigger. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`.

## Deviations
- none recorded

## Angular notes
Root `[(value)]` is always a `string[]` (one entry in single mode); item `value` is a plain `input` (not required) so parent computeds never hit NG0950.

## UNKNOWN
- Verified in a real browser: toggle + arrows. Not verified: Home/End against Radix, screen-reader announcements.
