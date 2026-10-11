# Direction — behavior spec

Evidence: **[SOURCE]** no per-slot capture was kept for this component. 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Scoped direction provider: sets `dir` on its element and overrides CDK `Directionality` for descendants so components resolve keyboard/layout direction from the subtree.

## Structure 
_See the README parts table._


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `[uiDirection]="rtl|ltr"` sets the attribute and provides `Directionality` (`value`, `change`).
- Verified in browser: Tabs inside an RTL provider handle ArrowLeft as "next".

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Radix's DirectionProvider is a React context; ours substitutes the CDK token, so it also affects CDK overlay positioning for components that read `Directionality`.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Overlays portaled outside the provider element use the document direction (limitation of DOM portals).
