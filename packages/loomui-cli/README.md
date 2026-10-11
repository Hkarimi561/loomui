# Loom UI

**Copy-in** CLI for [Loom UI](../../README.md). Components are copied into *your* project, so you own and edit them.

```bash
npx loomui init                      # loomui.json, theme CSS, utils
npx loomui add button dialog         # components + their dependencies
npx loomui add --all
npx loomui list
```

Options: `--dir src/app/ui` · `--css src/styles.css` · `--overwrite` · `--install` (runs `npm install` for the required packages) · `--registry <dir|url>` (or `LOOMUI_REGISTRY`).

What `init` does: writes `loomui.json`, copies the theme to `<css dir>/loomui.css` (design tokens, `.dark`, the custom `data-*` variants, toast CSS, accent presets), adds `@import './loomui.css'` to your global stylesheet and copies `utils`.
What `add` does: copies `<uiDir>/<component>/`, resolves dependencies between components (e.g. dialog → button, utils), rewrites `@loomui/ui/x` imports to relative paths and lists the npm packages to install.

Requirements: Angular 22+, Tailwind v4 (`@import 'tailwindcss'`), `@angular/cdk`.

## Rebuilding the registry
From the repo root: `npm run registry` (theme CSS → showcase docs → registry JSON in `packages/loomui-cli/registry`).
