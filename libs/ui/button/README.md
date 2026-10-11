# uiButton

Directive that turns a native `<button>` or `<a>` into a shadcn/ui Button.

```ts
import { UiButton } from '@loomui/ui/button';

@Component({
  imports: [UiButton],
  template: `
    <button uiButton>Default</button>
    <button uiButton variant="outline" size="sm">Outline</button>
    <button uiButton variant="destructive" disabled>Delete</button>
    <a uiButton variant="link" href="/docs">Docs</a>
  `,
})
export class Demo {}
```

| Input | Values | Default |
|---|---|---|
| `variant` | `default` `outline` `secondary` `ghost` `destructive` `link` | `default` |
| `size` | `default` `xs` `sm` `lg` `icon` `icon-xs` `icon-sm` `icon-lg` | `default` |
| `class` | extra classes, merged with `tailwind-merge` | — |

Emits `data-slot="button"`, `data-variant`, `data-size`. `buttonVariants()` is exported for styling other elements.
Icon padding hooks: put `data-icon="inline-start"` / `"inline-end"` on a child icon.

Spec: `docs/behavior-specs/button.md` · Manual checks: `docs/manual-tests/button.md`

Deviations: logical `ps-/pe-` instead of `pl-/pr-`; `sm` height `h-7` is inferred; no `asChild` (use `<a uiButton>`).
