# Switch — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/switch` (checked, unchecked, disabled, `data-size="sm"`). Not done: live keyboard run, source/Radix cross-check, RTL, dark.

## Structure [REA-DOM]
```
<button type="button" role="switch" aria-checked="false|true" data-state="unchecked|checked"
        value="on" data-slot="switch" data-size="default|sm" [disabled data-disabled=""]>
  <span data-slot="switch-thumb" data-state="…" [data-disabled=""]></span>
</button>
```
Thumb always rendered; state mirrored on thumb. Default track `h-[18.4px] w-[32px]`, sm `h-[14px] w-[24px]`; thumb `size-4` / `size-3`; checked thumb `translate-x-[calc(100%-2px)]`; unchecked track `bg-input` (`dark:bg-input/80`), checked `bg-primary`.

## Keyboard
Native button semantics: Space and Enter both activate (UNKNOWN on the live page — not exercised; Radix Switch is a plain button, unlike Checkbox it does not block Enter). Focus ring `focus-visible:ring-3 ring-ring/50`.

## Deviations
RTL: observed classes translate only `+x`; added `rtl:-translate-x-…` so the thumb sits on the correct side. Needs verification in RTL (see manual test).

## Angular notes
`button[uiSwitch]`: `[(checked)]`, `ControlValueAccessor`, signal-forms-compatible `checked`/`disabled`/`invalid`.

## UNKNOWN
Live key behavior; screen-reader output ("switch, on/off"); RTL thumb position; dark colors.
