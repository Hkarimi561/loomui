# Command — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/command` (inline demo, static). **[OUR-BUILD]** playground with real keys and typing. Not done: dialog variant, original keyboard/typing run, source cross-check (cmdk).

## Structure [REA-DOM]
```
root:   <div tabindex="-1" data-slot="command" cmdk-root class="flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground …">
wrapper:<div data-slot="command-input-wrapper" class="p-1 pb-0">   (contents: an input group — classes not captured)
input:  <input data-slot="command-input" cmdk-input role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="<list>" aria-labelledby="<label>" id=… autocomplete="off" autocorrect="off" spellcheck="false" type="text" class="w-full text-sm outline-hidden …">
list:   <div data-slot="command-list" cmdk-list role="listbox" tabindex="-1" aria-label="Suggestions" id="<list>" style="--cmdk-list-height:…" class="no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none">
group:  <div data-slot="command-group" cmdk-group role="presentation" data-value="Suggestions" class="overflow-hidden p-1 text-foreground …"> (heading: [cmdk-group-heading] px-2 py-1.5 text-xs font-medium text-muted-foreground)
item:   <div data-slot="command-item" cmdk-item role="option" aria-selected="true|false" aria-disabled="false|true" data-disabled="false|true" data-selected="true|false" data-value="Calendar" id=…>
sep:    <div data-slot="command-separator" cmdk-separator role="separator" class="-mx-1 h-px bg-border">
shortcut:<span data-slot="command-shortcut" class="ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground">
```
- Exactly one item has `aria-selected="true"` and `data-selected="true"` (first enabled one initially: "Calendar").
- Disabled item: `aria-disabled="true"`, `data-disabled="true"` (styles use `data-[disabled=true]:`).
- Item class: `group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none … data-selected:bg-muted data-selected:text-foreground …`.
- The `aria-activedescendant` attribute was **not** present on the captured (unfocused) input; cmdk sets it when navigating — UNKNOWN on the original, implemented.

## Behavior (our build, verified)
| Action | Result |
|---|---|
| Typing | filters items by value/keywords (case-insensitive substring); groups with no visible items hide; separators hide while searching; empty message shows when nothing matches |
| Down / Up / Home / End | move selection through enabled visible items; disabled skipped; wraps |
| Ctrl+N/J, Ctrl+P/K | same as Down/Up (cmdk bindings) |
| Enter | fires the selected item's `select` |
| Pointer move | selects the hovered item |
| Focus | stays in the input throughout (`aria-activedescendant` points to the item) |

## Deviations
- Results are **not re-ordered by score** (cmdk sorts by fuzzy score); we do plain substring filtering.
- Whether cmdk wraps at the ends is UNKNOWN; we wrap.
- Input wrapper/icon styling invented (only `p-1 pb-0` observed). No `CommandDialog` yet.

## UNKNOWN
cmdk scoring/ordering; wrap behavior; wrapper classes; screen-reader output; RTL; dialog variant.
