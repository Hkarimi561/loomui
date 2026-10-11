# Dialog — behavior spec

Status: DRAFT for review. Nothing has been implemented from this spec yet.

## Evidence legend

| Tag | Source |
|---|---|
| **[REA-DOM]** | `capture_browser_scenario` (REA, headless Chromium 155, `reduced_motion: no-preference`, 1280×900) on `https://ui.shadcn.com/docs/components/radix/dialog`. DOM captured after each step (`s1_closed`, `s2_open`, `s3_open_settled`, `s4_esc`, `s5_after_esc_immediate` at +30 ms, `s6_closed_settled` at +700 ms). Bundle: `docs/evidence/dialog-radix-scenario.json` (record `ev_8ef928d4…`). |
| **[REA-A11Y]** | Same tool, accessibility snapshot of the open state (first run, `ev_b55bb242…` is the earlier failed *base* run; the a11y text is quoted below). |
| **[LIVE]** | Built-in browser on the same page: real key presses (`Enter`, `Tab`, `Shift+Tab`, `Escape`, mouse click) with `document.activeElement` read after each. REA's scenario tool cannot read `activeElement`, so this evidence is **not** REA. |
| **[NOT DONE]** | Cross-check against `shadcn-ui/ui` source and Radix source was **not** performed yet. |

## 0. Important finding: the live site has two Dialogs

`/docs/components/dialog` **redirects** to `/docs/components/base/dialog`. The site now defaults to a **Base UI** implementation. A **Radix** one is at `/docs/components/radix/dialog`.
They differ observably [REA-DOM, `ev_b55bb242…`]:

| | Radix variant | Base UI variant |
|---|---|---|
| Trigger `data-state` | `closed` / `open` | **absent** on trigger |
| Trigger `aria-controls` | present | present on search trigger only; docs trigger has `data-base-ui-click-trigger`, `tabindex=0` |
| ids | `radix-_R_…` | `base-ui-_R_…` |

This spec describes the **Radix variant**, because the brief asks for `data-state` + tw-animate-css parity. **Decision needed from you** (see end).

## 1. Parts and DOM structure (open state) [REA-DOM s3_open_settled]

```
<button data-slot="button" data-variant="outline" data-size="default"
        type="button" aria-haspopup="dialog" aria-expanded="true"
        aria-controls="<contentId>" data-state="open">Open Dialog</button>     ← DialogTrigger (asChild Button)

<body data-scroll-locked="1" style="pointer-events: none;">
  <div hidden aria-hidden="true" data-aria-hidden="true">…</div>            ← page siblings hidden
  <div data-slot="layout" aria-hidden="true" data-aria-hidden="true">…</div>
  …
  <div data-slot="dialog-overlay" data-state="open" aria-hidden="true"
       data-aria-hidden="true" style="pointer-events: auto;">                ← Overlay (portaled to <body>)
  <div role="dialog" id="<contentId>" aria-labelledby="<id>H1"
       aria-describedby="<id>H2" data-state="open" data-slot="dialog-content"
       tabindex="-1" style="pointer-events: auto;">                           ← Content (portaled to <body>)
    <div data-slot="dialog-header">
      <h2 id="<id>H1" data-slot="dialog-title">Edit profile</h2>
      <p  id="<id>H2" data-slot="dialog-description">…</p>
    </div>
    …body…
    <div data-slot="dialog-footer"> <button>Cancel</button> <button type="submit">Save changes</button> </div>
    <button data-slot="dialog-close" data-variant="ghost" data-size="icon-sm" type="button">
      <svg …/><span class="sr-only">Close</span>
    </button>                                                                 ← built-in close, LAST in DOM order
  </div>
  <span data-radix-focus-guard tabindex="0" aria-hidden="true"
        style="outline:none;opacity:0;position:fixed;pointer-events:none"></span>
</body>
```

Facts:
- Overlay and Content are **siblings under `<body>`** (portal target = `document.body`), not nested. [REA-DOM]
- `aria-labelledby` → title id, `aria-describedby` → description id; ids are `<contentId>H1` / `<contentId>H2`. [REA-DOM]
- Trigger `aria-controls` equals the content `id` **even while closed** (content not mounted). [REA-DOM s1_closed vs s3]
- Trigger flips `aria-expanded` false→true→false and `data-state` closed→open→closed. [REA-DOM s1/s3/s6]
- Role is `dialog` (not `alertdialog`); no `aria-modal` attribute observed. Modality is conveyed by `aria-hidden` on everything else. [REA-DOM]
- Demo trigger sits inside a `<form>`; the Save button is `type=submit`. [REA-DOM] See §9.

### Accessibility tree [REA-A11Y]
```
dialog "Edit profile":
  heading "Edit profile" [level=2]
  paragraph: Make changes to your profile here. Click save when you're done.
  group: text: Name; textbox "Name": Pedro Duarte
  group: text: Username; textbox "Username": "@peduarte"
  button "Cancel"   button "Save changes"
  button "Close": img, text: Close
```
Accessible name = title text; description = paragraph.

## 2. States and `data-*` transitions

| Moment | Trigger | Overlay | Content | `<body>` |
|---|---|---|---|---|
| closed (s1) | `data-state=closed`, `aria-expanded=false` | not in DOM | not in DOM | no style attr, no `data-scroll-locked` |
| open (s3) | `open`, `true` | `data-state=open` | `data-state=open` | `data-scroll-locked="1"`, `style="pointer-events: none;"` |
| closing (s5, +30 ms after Esc) | back to `closed` | still mounted, `data-state=closed` | still mounted, `data-state=closed` | **still** locked |
| closed (s6, +700 ms) | `closed` | removed | removed | `style=""`, `data-scroll-locked` removed |

So the exit animation runs with the node mounted and `data-state=closed`; unmount happens after the animation. [REA-DOM]
Overlay and Content explicitly set `pointer-events: auto` inline while body is `none`. [REA-DOM]

## 3. CSS / animation contract [REA-DOM class strings]

- Overlay: `fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0`
- Content: `fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-sm`
- Close button: `… absolute top-2 right-2` (physical `right`), `size-7`, `data-variant=ghost`, `data-size=icon-sm`.
- Duration: 100 ms (`duration-100`).
- CSS variables referenced: `--popover`, `--popover-foreground`, `--foreground` (ring `foreground/10`), `--radius-md`, `--ring`, `--muted`, `--muted-foreground`.
- The classes use `data-open:` / `data-closed:`, while the element carries `data-state="open|closed"`. **UNKNOWN**: how `data-open:` maps to `data-state` (a Tailwind `@custom-variant` is the likely mechanism). A scan of the page's CSSOM for rules containing `data-open`/`data-closed` returned nothing, so it was not confirmed. The Angular lib must define the variants itself, so this is a build decision, not a blocker.

## 4. Keyboard map [LIVE]

Trigger focused, dialog closed:

| Key | Observed result |
|---|---|
| `Enter` | Opens. Focus moves to the **first tabbable element in the content** (`input[name=name]`), *not* to the content container and *not* the Close button. |
| `Space` | **UNKNOWN** (not exercised; native button behavior expected). |

Dialog open, focus starts on `input[name=name]`:

| Key | Observed |
|---|---|
| `Tab` ×1 | `input[name=username]` |
| `Tab` ×2 | `Cancel` |
| `Tab` ×3 | `Save changes` |
| `Tab` ×4 | `Close` (`data-slot=dialog-close`) |
| `Tab` ×5 | wraps to `input[name=name]` — **focus is trapped** |
| `Shift+Tab` (from `name`, after wrap) | goes to `Close` (reverse wrap) |
| `Escape` | closes; focus **returns to the trigger** (`Open Dialog`) |
| Click on overlay | closes; focus returns to the trigger |

Tab order = DOM order; the Close button is last because it is last in the DOM. No arrow-key, Home/End, or typeahead behavior applies to Dialog.

Not tested: `Shift+Tab` from the very first element on first open, Enter inside an input (form submit), Escape while an inner input has focus, nested dialogs.

## 5. Focus
- On open: first tabbable inside Content (`autoFocus`-style) [LIVE]. If Content has no tabbable children: **UNKNOWN** (Radix falls back to the content container, which has `tabindex=-1`; unverified here).
- Trap: Tab/Shift+Tab cycle within Content [LIVE]. Two `data-radix-focus-guard` sentinel spans are Radix's mechanism; only the end-of-body one was inspected; the Angular CDK `FocusTrap` replaces them.
- On close: focus returns to the trigger [LIVE] (both Esc and outside click).

## 6. Dismissal / scroll lock / portal
- Esc closes [LIVE]. Outside (overlay) click closes [LIVE].
- Scroll lock: `body[data-scroll-locked=1]` plus `pointer-events:none`, released after the exit animation [REA-DOM]. The actual `overflow` handling (react-remove-scroll) was not captured: **UNKNOWN** (no overflow style on body observed in either state, so the lock may be via a style tag).
- Portal to `<body>` [REA-DOM]. All other body children get `aria-hidden` + `data-aria-hidden` while open (11 → 23 `aria-hidden` nodes; 0 → 6 `data-aria-hidden`) [REA-DOM].

## 7. Screen reader expectations (derived from the a11y tree, not tested with a real AT)
On open: "Edit profile, dialog" + description. Fields announce their labels. Close button announces "Close, button". **UNKNOWN**: actual NVDA/VoiceOver output.

## 8. RTL / dark mode
- **UNKNOWN / not captured.** The page itself offers an Arabic variant (`فتح الحوار`); not yet inspected.
- Known gap in shadcn: Close uses physical `right-2`, and `left-1/2 -translate-x-1/2` centering is direction-agnostic. The Angular version will use `end-2` — a **deliberate deviation** (brief requires logical properties).

## 9. Radix → Angular mapping, and known divergences

| Radix | Angular implementation |
|---|---|
| Root / controlled `open` | `uiDialog` directive, `open = model(false)` |
| Portal | CDK `Overlay` (global position strategy, centered) with its own backdrop disabled; render our `uiDialogOverlay` in the overlay pane |
| FocusScope | CDK `FocusTrap` (`autoCapture`), restore focus to trigger on dispose |
| DismissableLayer | Overlay `keydownEvents` (Esc) + `outsidePointerEvents` |
| `aria-hidden` others | **Not provided by CDK** — implement a small helper that sets `aria-hidden` on overlay-container siblings and restores them |
| react-remove-scroll | CDK `BlockScrollStrategy`; also set `data-scroll-locked` for parity |
| Presence (exit animation) | Keep content mounted with `data-state=closed` until `animationend` (fallback timeout 100 ms+) |
| React-tree event bubbling | Angular portal does **not** bubble submit/click to the trigger's ancestors (e.g. the `<form>` around the trigger). Deviation; document in README. |

## 10. UNKNOWN summary
1. `data-open:` ↔ `data-state` variant mechanism.
2. `Space` on trigger; Enter-to-submit inside inputs; Esc from inside an input.
3. Initial focus when content has no tabbable child.
4. Exact scroll-lock mechanism.
5. RTL and dark-mode rendering.
6. Real screen-reader output.
7. Source/Radix cross-check (not done).
8. Base UI variant behavior (only trigger attributes observed).
