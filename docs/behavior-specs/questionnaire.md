# Questionnaire — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/questionnaire.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Step-by-step form: one question visible at a time, progress text, radio/checkbox choices with shortcut keys, text input, validation and Previous / Skip / Next / Submit actions.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `questionnaire` | `form` | `data-current=1\|2 data-first="" data-total=3\|1\|2\|4 data-shortcuts=letters\|numbers novalidate="" data-last=""` |
| `questionnaire-progress` | `div` | `data-current=1\|2 data-first="" data-total=3\|2\|4 aria-label=Questionnaire progress aria-live=polite aria-valuemax=3\|2\|4 aria-valuemin=1 aria-valuenow=1\|2 aria-valuetext=Question 1 of 3\|Question 1 of 2\|Question 2 of 3\|Question 1 of 4 role=progressbar` |
| `questionnaire-item` | `fieldset` | `data-active="" data-required="" data-status=unanswered\|answered aria-keyshortcuts=Meta+Enter Control+Enter ArrowUp ArrowDown\|Meta+Enter Control+Enter ArrowUp ArrowDown ArrowLeft ArrowRight\|Meta+Enter Control+Enter ArrowUp ArrowDown ArrowRight tabindex=-1 data-multiple="" hidden="" inert="" data-disabled="" disabled=""` |
| `questionnaire-title` | `legend` | — |
| `questionnaire-description` | `p` | — |
| `questionnaire-choices` | `div` | `data-shortcuts=letters\|numbers` |
| `questionnaire-choice` | `label` | `data-unchecked="" data-shortcut=A\|B\|C\|D data-type=radio\|checkbox data-checked="" data-disabled=""` |
| `questionnaire-choice-input` | `input` | `data-unchecked="" data-shortcut=A\|B\|C\|D data-type=radio\|checkbox aria-keyshortcuts=A\|B\|C\|D type=radio\|checkbox required="" data-checked="" checked="" data-disabled="" disabled=""` |
| `questionnaire-choice-indicator` | `span` | `aria-hidden=true` |
| `questionnaire-choice-indicator-dot` | `span` | — |
| `questionnaire-choice-indicator-check` | `svg` | `xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round` |
| `questionnaire-choice-label` | `span` | — |
| `questionnaire-choice-shortcut` | `span` | `data-shortcut=A\|B\|C\|D aria-hidden=true hidden=""` |
| `questionnaire-input-wrapper` | `div` | — |
| `questionnaire-input` | `input` | `data-empty="" form="" type=text aria-label=Another agent feature\|Another refactoring approach\|Another implementation constraint\|Saved migration note data-filled="" aria-keyshortcuts=Enter` |
| `questionnaire-error` | `p` | `hidden=""` |
| `questionnaire-actions` | `div` | — |
| `questionnaire-previous` | `button` | `data-status=unanswered\|answered data-hidden="" aria-hidden=true hidden="" inert="" tabindex=-1 type=button data-size=default data-variant=outline data-visible=""` |
| `questionnaire-skip` | `button` | `data-status=unanswered data-hidden="" aria-hidden=true hidden="" inert="" tabindex=-1 type=button data-size=default data-variant=outline` |
| `questionnaire-next` | `button` | `data-shortcut=Enter data-status=unanswered\|answered data-visible="" aria-keyshortcuts=Enter type=button data-size=default data-variant=default\|secondary data-disabled="" disabled=""` |
| `questionnaire-submit` | `button` | `data-status=unanswered\|answered data-hidden="" aria-hidden=true hidden="" inert="" tabindex=-1 type=submit data-size=default data-variant=default data-shortcut=Enter data-visible="" aria-keyshortcuts=Enter data-disabled="" disabled=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Root `<form novalidate>` with `data-current|total|first|last|shortcuts`.
- Items are `fieldset`s: hidden + inert unless active; `data-status` pending/answered/invalid.
- Required validation runs on Next and on Submit; Submit jumps to the first invalid question.
- Progress: `role="progressbar"` with text "Question X of N". Verified: required error, next, multi-select, text answer, submit payload.

## Keyboard
| Keys | Result |
|---|---|
| 1–9 / A–Z | Pick the choice with that shortcut in the active question (not while typing in a text input). |
| Enter | Next (Submit on the last question; not on buttons/textarea). |
| Ctrl / Cmd + Enter | Submit. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `Enter`.

## Deviations
- Shortcut/Enter handling and validation messages are our reconstruction from observed attributes; the original sources were not available.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Original submit/skip semantics and error copy.
- Behavior with only optional questions.
