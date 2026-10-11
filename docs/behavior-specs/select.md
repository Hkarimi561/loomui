# Select — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/select` with the first demo open (trigger, content, group, label, item), plus other triggers (closed, disabled, `sm`). **[OUR-BUILD]** playground with real keys. Not done: original keyboard run, source cross-check, scroll buttons, RTL.

## Structure [REA-DOM]
```
trigger: <button type="button" role="combobox" aria-controls="<cid>" aria-expanded="true|false" aria-autocomplete="none" dir="ltr"
          data-state="open|closed" [data-placeholder=""] [disabled data-disabled=""] data-slot="select-trigger" data-size="default|sm">
          <span data-slot="select-value" style="pointer-events:none">…</span> <svg chevron/>
content: <div role="listbox" id="<cid>" data-state="open" dir="ltr" data-slot="select-content" data-align-trigger="true" tabindex="-1" style="box-sizing:border-box; max-height:100%; display:flex; flex-direction:column; outline:none; pointer-events:auto">
  group:  <div role="group" aria-labelledby="<lid>" data-slot="select-group" class="scroll-my-1 p-1">
  label:  <div id="<lid>" data-slot="select-label" class="px-1.5 py-1 text-xs text-muted-foreground">
  item:   <div role="option" aria-labelledby="<tid>" aria-selected="false" data-state="unchecked" tabindex="-1" data-slot="select-item" data-radix-collection-item data-highlighted="">
```
- `data-placeholder=""` present while no value (drives `data-placeholder:text-muted-foreground`).
- Trigger `aria-controls` points at the listbox id even while closed.
- `data-align-trigger="true"` = Radix **item-aligned** positioning (list overlaps the trigger so the selected item sits over it). One other trigger on the page was a **Base UI** select (`aria-haspopup="listbox"`, `base-ui-` ids) — different implementation.
- Classes: trigger `flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input … data-[size=default]:h-8 data-[size=sm]:h-7 …`; content `relative z-50 max-h-(--radix-select-content-available-height) min-w-36 … rounded-lg bg-popover shadow-md ring-1 ring-foreground/10 duration-100 … data-[align-trigger=true]:animate-none …`; item `relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent …`.

## Behavior (our build, verified with real keys)
| Action | Result |
|---|---|
| Enter on trigger | opens; first item focused (or the selected item on re-open) |
| Down / Up | move highlight, skipping disabled options |
| Enter on option | selects, closes, trigger shows the label, focus returns to the trigger |
| Escape | closes, focus returns to trigger |
| Tab | blocked while open |
| Forms | `ngModel` / reactive forms via ControlValueAccessor; closed trigger shows the label of the initial value |
Space, ArrowDown/ArrowUp on the closed trigger also open it (Radix behavior, partly exercised); typeahead on the open list implemented, not exercised.

## Deviations
- **No item-aligned positioning**: the list opens below the trigger (popper mode) with width ≥ trigger width.
- Content is always in the DOM (`hidden`), which lets us read option labels for the closed trigger.
- No scroll-up/scroll-down buttons; no hidden native `<select>` for form posts.

## UNKNOWN
Original keyboard behavior; typeahead on closed trigger; item-aligned geometry; native-select fallback markup; RTL; screen-reader output.
