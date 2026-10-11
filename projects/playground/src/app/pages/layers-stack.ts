import { Component } from '@angular/core';
import { UI_ALERT } from '@loomui-ng/ui/alert';
import { UiBadge } from '@loomui-ng/ui/badge';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_CARD } from '@loomui-ng/ui/card';
import { UiIcon } from '@loomui-ng/ui/icon';
import { UiSwitch } from '@loomui-ng/ui/switch';
import '../icons';

/** Dialog, menu and toast stacked in 3D; the layers fan out on hover or focus. Built from the real components. */
@Component({
  selector: 'app-layers-stack',
  imports: [UI_ALERT, UI_CARD, UiBadge, UiButton, UiIcon, UiSwitch],
  template: `
    <div class="stack3d mx-auto h-[22rem] w-full max-w-sm" tabindex="0" aria-label="Layered components: toast, menu and dialog">
      <div class="stack3d-inner h-full w-full">
        <!-- back: toast / alert -->
        <div class="stack3d-card" style="--i: 2" aria-hidden="true">
          <ui-alert class="h-28 shadow-xl">
            <ui-icon name="bell" />
            <ui-alert-title>Deployment finished</ui-alert-title>
            <ui-alert-description>Your project is live. It took 4.2s.</ui-alert-description>
          </ui-alert>
        </div>
        <!-- middle: menu -->
        <div class="stack3d-card" style="--i: 1" aria-hidden="true">
          <div class="mt-16 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl">
            @for (m of menu; track m.label) {
              <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm" [class.bg-muted]="m.active">
                <ui-icon [name]="m.icon" class="text-muted-foreground" /> {{ m.label }}
                @if (m.kbd) { <span class="ms-auto text-xs tracking-widest text-muted-foreground">{{ m.kbd }}</span> }
              </div>
            }
          </div>
        </div>
        <!-- front: dialog -->
        <div class="stack3d-card" style="--i: 0">
          <ui-card class="mt-28 shadow-2xl">
            <ui-card-header>
              <ui-card-title class="flex items-center gap-2">Notifications <ui-badge variant="secondary">3 new</ui-badge></ui-card-title>
              <ui-card-description>Choose what you want to hear about.</ui-card-description>
            </ui-card-header>
            <ui-card-content class="grid gap-3">
              <label class="flex items-center justify-between text-sm">Push <ui-switch [checked]="true" aria-label="Push notifications" /></label>
              <label class="flex items-center justify-between text-sm">Email <ui-switch aria-label="Email notifications" /></label>
            </ui-card-content>
            <ui-card-footer class="gap-2">
              <ui-button size="sm" variant="outline">Later</ui-button>
              <ui-button size="sm">Save</ui-button>
            </ui-card-footer>
          </ui-card>
        </div>
      </div>
    </div>
  `,
})
export class LayersStack {
  readonly menu = [
    { icon: 'search', label: 'Search…', kbd: '⌘K', active: true },
    { icon: 'palette', label: 'Theme', kbd: '' },
    { icon: 'languages', label: 'Language', kbd: '' },
    { icon: 'package', label: 'Install', kbd: '⌘I' },
  ];
}
