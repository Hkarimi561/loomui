# Loom UI

**Copy-in** CLI for [Loom UI](../../README.md). Components are copied into *your* project, so you own and edit them.

```bash
npx @loomui-ng/cli init                      # loomui.json, theme CSS, utils
npx @loomui-ng/cli add button dialog         # components + their dependencies
npx @loomui-ng/cli add --all
npx @loomui-ng/cli list
```

Options: `--dir src/app/ui` · `--css src/styles.css` · `--overwrite` · `--no-install` (print the required npm packages instead of installing them) · `--registry <dir|url>` (or `LOOMUI_REGISTRY`).

What `init` does: writes `loomui.json`, copies the theme to `<css dir>/loomui.css` (design tokens, `.dark`, the custom `data-*` variants, toast CSS, accent presets), adds `@import './loomui.css'` to your global stylesheet and copies `utils`.
What `add` does: copies `<uiDir>/<component>/`, resolves dependencies between components (e.g. dialog → button, utils), rewrites `@loomui-ng/ui/x` imports to relative paths and installs the npm packages the copied code needs (clsx, tailwind-merge, tw-animate-css, …) unless they are already in your package.json.

Requirements: Angular 22+, Tailwind v4 (`@import 'tailwindcss'`), `@angular/cdk`.

## Rebuilding the registry
From the repo root: `npm run registry` (theme CSS → showcase docs → registry JSON in `packages/loomui-cli/registry`).
