# Badge — behavior spec

Evidence: **[REA-DOM]** `capture_browser_scenario` DOM of `ui.shadcn.com/docs/components/radix/badge` (Chromium 155). Not done: source cross-check, hover/focus computed styles, RTL, dark capture.

## Structure [REA-DOM]
`<span data-slot="badge" data-variant="…">`; also valid on `<a>` (the `[a]:hover:` classes only apply to links). No role, no ARIA, not focusable by itself.

## Variants (default: `default`) [REA-DOM]
| variant | colors |
|---|---|
| default | `bg-primary text-primary-foreground [a]:hover:bg-primary/80` |
| secondary | `bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80` |
| destructive | `bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 … [a]:hover:bg-destructive/20` |
| outline | `border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground` |
| ghost | `hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50` |

Base: `inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all` + focus-visible ring + `aria-invalid` styles + `[&>svg]:size-3!`.

## Keyboard / ARIA
None of its own. On `<a>`: native link behavior. UNKNOWN: screen-reader output (plain text).

## Deviations
`pl-/pr-` → `ps-/pe-` for icon padding. Directive (`uiBadge`) instead of component; no `asChild`.

## UNKNOWN
A `link` variant (not observed); computed hover colors; RTL/dark rendering; source cross-check.
