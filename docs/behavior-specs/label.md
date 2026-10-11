# Label — behavior spec

Evidence: **[REA-DOM]** DOM of `ui.shadcn.com/docs/components/radix/label`. Not done: source/Radix cross-check, screen-reader run.

## Structure [REA-DOM]
`<label data-slot="label" for="terms" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">`.

## Behavior
- Native `<label for>` association: clicking the label activates the control (verified on our Checkbox in the playground; original not exercised). Radix Label additionally prevents text selection on double-click (`select-none` observed; the mouse handler is UNKNOWN).
- Dimmed when a sibling `.peer` control is `:disabled` or an ancestor `.group` has `data-disabled="true"`.
- No keyboard behavior; not focusable.

## Deviations
Directive on a native `<label>`; no JS double-click-select prevention beyond `select-none`.

## UNKNOWN
Radix `onMouseDown` double-click handling; screen-reader output.
