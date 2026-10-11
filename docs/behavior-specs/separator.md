# Separator — behavior spec

Evidence: **[REA-DOM]** DOM of `ui.shadcn.com/docs/components/radix/separator`.

## Structure [REA-DOM]
`<div data-slot="separator" data-orientation="horizontal|vertical" role="none" class="shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch">`
Observed in both orientations: **`role="none"`** (decorative). Vertical sample also used `h-full` via an older class string (`data-[orientation=vertical]:h-full`) — two class generations coexist on the page; the newer `self-stretch` form is used.

## Behavior
No keyboard, no focus. With `decorative=false` Radix exposes `role="separator"` (+ `aria-orientation="vertical"` only for vertical). That path was **not observed live** (UNKNOWN) but is implemented per Radix docs.

## Deviations
Directive `uiSeparator`; `decorative` input defaults to true like Radix.

## UNKNOWN
Non-decorative output on the live site; RTL (symmetrical, none expected); dark rendering (`bg-border` token).
