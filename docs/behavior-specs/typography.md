# Typography — behavior spec

Evidence: **[SOURCE]** no per-slot capture was kept for this component. 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Classic shadcn typography styles as a directive (`uiTypography="h1|h2|h3|h4|p|blockquote|list|code|lead|large|small|muted"`).

## Structure 
_See the README parts table._


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Applies class strings only; use semantic elements yourself.

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- The live Typography page now redirects to "Typeset" (a CSS system with a builder). Typeset is **not** reproduced; this is the previous recipe.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Typeset system behavior and builder output.
