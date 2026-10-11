import { Component, inject } from '@angular/core';
import { UiBadge } from '@loomui/ui/badge';
import { UiButton } from '@loomui/ui/button';
import { UiIcon } from '@loomui/ui/icon';
import { UI_INPUT } from '@loomui/ui/input';
import { UiProgress } from '@loomui/ui/progress';
import { UiSwitch } from '@loomui/ui/switch';
import '../icons';
import { AppState } from '../app-state';

/** A miniature UI; every colour comes from the CSS variables of whatever theme scope it sits in. */
@Component({
  selector: 'app-theme-mini',
  imports: [UiButton, UiBadge, UiSwitch, UiProgress, UI_INPUT],
  template: `
    <div class="grid gap-2.5" inert aria-hidden="true">
      <div class="flex flex-wrap items-center gap-1.5">
        <ui-button size="sm">Primary</ui-button>
        <ui-button size="sm" variant="secondary">Secondary</ui-button>
        <ui-button size="sm" variant="outline">Outline</ui-button>
      </div>
      <ui-input placeholder="Focus me" class="h-7" />
      <div class="flex items-center gap-3">
        <ui-switch [checked]="true" size="sm" />
        <ui-badge>New</ui-badge>
        <ui-progress [value]="64" class="flex-1" />
      </div>
    </div>
  `,
})
export class ThemeMini {}

@Component({
  selector: 'app-themes-page',
  imports: [ThemeMini, UiBadge, UiButton, UiIcon],
  template: `
    <div class="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Themes</h1>
        <p class="mt-2 max-w-2xl text-muted-foreground">
          Accent presets for the whole kit. Each card shows light and dark side by side; “Apply” switches the entire site. The theme is plain CSS
          variables, so you can copy a preset's block from <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">loomui.css</code>.
        </p>
      </header>

      <ul class="grid gap-5 md:grid-cols-2">
        @for (a of state.accents; track a.id) {
          <li class="overflow-hidden rounded-2xl border bg-card shadow-xs transition-shadow hover:shadow-md" [class.ring-2]="state.accent() === a.id" [class.ring-primary]="state.accent() === a.id">
            <div class="flex items-center gap-3 border-b px-4 py-3">
              <span class="size-5 rounded-full ring-2 ring-border" [style.background]="a.color"></span>
              <h2 class="font-semibold">{{ a.label }}</h2>
              @if (state.accent() === a.id) {
                <ui-badge variant="secondary"><ui-icon name="check" class="size-3" /> Active</ui-badge>
              }
              <ui-button class="ms-auto" size="sm" [variant]="state.accent() === a.id ? 'secondary' : 'default'" (click)="state.setAccent(a.id)">
                {{ state.accent() === a.id ? 'Applied' : 'Apply' }}
              </ui-button>
            </div>
            <div class="grid sm:grid-cols-2">
              <div class="force-light bg-background p-4 text-foreground" [class]="'theme-' + a.id">
                <p class="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Light</p>
                <app-theme-mini />
              </div>
              <div class="dark bg-background p-4 text-foreground" [class]="'theme-' + a.id">
                <p class="mb-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Dark</p>
                <app-theme-mini />
              </div>
            </div>
          </li>
        }
      </ul>
    </div>
  `,
})
export class ThemesPage {
  protected readonly state = inject(AppState);
}
