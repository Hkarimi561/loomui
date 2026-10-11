import { Component } from '@angular/core';
import { UiButton } from '@loomui/ui/button';

@Component({
  selector: 'app-button-page',
  imports: [UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Button</h1>
    <p class="mb-6 text-muted-foreground">Directive on a native &lt;button&gt; or &lt;a&gt;. Spec: docs/behavior-specs/button.md</p>

    @for (v of variants; track v) {
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <span class="w-24 text-sm text-muted-foreground">{{ v }}</span>
        @for (s of sizes; track s) {
          <button uiButton [variant]="v" [size]="s" [attr.aria-label]="s.startsWith('icon') ? s : null">
            {{ s.startsWith('icon') ? '★' : s }}
          </button>
        }
        <button uiButton [variant]="v" disabled>disabled</button>
        <a uiButton [variant]="v" href="#">link</a>
      </div>
    }
  `,
})
export class ButtonPage {
  readonly variants = ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const;
  readonly sizes = ['xs', 'sm', 'default', 'lg', 'icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const;
}
