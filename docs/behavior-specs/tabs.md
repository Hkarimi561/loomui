# Tabs — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/tabs` (horizontal default + line variants, vertical, disabled trigger). **[LIVE]** built-in browser: roving tabindex and Tab order read from the DOM; mouse click. Not done: source/Radix cross-check, RTL, dark.

## Structure [REA-DOM]
```
<div dir="ltr" data-orientation="horizontal|vertical" data-slot="tabs" class="group/tabs flex gap-2 data-horizontal:flex-col">
  <div role="tablist" aria-orientation=… data-slot="tabs-list" data-variant="default|line" data-orientation=… tabindex="0" style="outline:none">
    <button role="tab" aria-selected="true|false" aria-controls="<id>-content-<v>" id="<id>-trigger-<v>"
            data-state="active|inactive" data-orientation=… [disabled data-disabled=""]
            data-slot="tabs-trigger" data-radix-collection-item tabindex="-1">
  <div role="tabpanel" id="<id>-content-<v>" aria-labelledby="<id>-trigger-<v>" data-state="active|inactive"
       data-orientation=… tabindex="0" data-slot="tabs-content" [hidden]>
```
- Inactive panels stay in the DOM with `hidden=""`; active has `style="animation-duration:0s"`.
- Root forces `dir="ltr"` on the live page (deviation: we inherit direction).
- Roving tabindex observed: selected trigger `tabindex=0`, others `-1` (on first render all were `-1` until focus entered) [LIVE].

## Keyboard
| Key | Result |
|---|---|
| Tab into tablist | focuses the selected trigger [LIVE] |
| Tab from trigger | moves to the **active panel** (`tabindex=0`), not other triggers [LIVE] |
| Shift+Tab from panel | back to the selected trigger [LIVE] |
| Arrow Left/Right (vertical: Up/Down), Home, End, wrap, skip disabled, automatic activation | **UNKNOWN on the live site**: injected arrow/Home/End keys had no effect in the test harness, so nothing was observed. Implemented per Radix docs (automatic activation, wrapping, RTL-mirrored horizontal arrows). Verified only on our own build. |
| Click | selects (Radix selects on `mousedown`) |

## Variants
`tabs-list` `data-variant="default"` (`bg-muted`, active trigger gets bg-background + shadow) and `line` (transparent, active trigger underlined via `after:` bar, `gap-1`). List height `h-8` horizontal.

## Angular notes
CDK `FocusKeyManager` provides arrows/Home/End/wrap/skip-disabled; horizontal orientation takes `dir`. Needs playground custom variants `data-active`, `data-horizontal`, `data-vertical`.

## UNKNOWN
Live arrow-key behavior; `tabindex=0` on the tablist (observed but unexplained; omitted); manual activation mode; RTL; screen-reader output.
