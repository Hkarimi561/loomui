import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UI_CAROUSEL } from '@loomui/ui/carousel';
import { UI_CHART, type ChartConfig } from '@loomui/ui/chart';
import { UiDatePicker } from '@loomui/ui/date-picker';
import { UI_SIDEBAR } from '@loomui/ui/sidebar';
import { UI_CARD } from '@loomui/ui/card';

@Component({
  selector: 'app-carousel-page',
  imports: [UI_CAROUSEL],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Carousel</h1>
    <p class="mb-6 text-muted-foreground">Embla-powered. Spec: docs/behavior-specs/carousel.md</p>
    <div class="grid gap-16 ps-12 pe-12">
      <div uiCarousel class="mx-auto w-full max-w-xs">
        <div uiCarouselContent>
          @for (n of [1, 2, 3, 4, 5]; track n) {
            <div uiCarouselItem>
              <div class="grid aspect-square place-items-center rounded-xl border p-6 text-4xl font-semibold">{{ n }}</div>
            </div>
          }
        </div>
        <button uiCarouselPrevious></button>
        <button uiCarouselNext></button>
      </div>
      <div uiCarousel orientation="vertical" [opts]="{ align: 'start' }" class="mx-auto w-full max-w-xs">
        <div uiCarouselContent class="h-48">
          @for (n of [1, 2, 3, 4]; track n) {
            <div uiCarouselItem class="basis-1/2">
              <div class="grid h-full place-items-center rounded-xl border text-2xl font-semibold">{{ n }}</div>
            </div>
          }
        </div>
        <button uiCarouselPrevious></button>
        <button uiCarouselNext></button>
      </div>
    </div>
  `,
})
export class CarouselPage {}

@Component({
  selector: 'app-date-picker-page',
  imports: [UiDatePicker, ReactiveFormsModule],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Date Picker</h1>
    <p class="mb-6 text-muted-foreground">Popover + Calendar + Button. Spec: docs/behavior-specs/date-picker.md</p>
    <div class="grid gap-4">
      <ui-date-picker [(value)]="date" />
      <ui-date-picker [formControl]="ctrl" placeholder="Reactive form control" />
      <p class="text-sm text-muted-foreground">Signal: {{ date() }} · Form: {{ ctrl.value }}</p>
    </div>
  `,
})
export class DatePickerPage {
  readonly date = signal<Date | null>(null);
  readonly ctrl = new FormControl<Date | null>(null);
}

@Component({
  selector: 'app-chart-page',
  imports: [UI_CHART],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Chart</h1>
    <p class="mb-6 text-muted-foreground">Chart.js with a per-series config and CSS-variable colors. Spec: docs/behavior-specs/chart.md</p>
    <div class="grid max-w-3xl gap-8 md:grid-cols-2">
      <ui-chart type="bar" [data]="rows" xKey="month" [config]="config" label="Visitors by month (bar)" />
      <ui-chart type="line" [data]="rows" xKey="month" [config]="config" label="Visitors by month (line)" />
      <ui-chart type="doughnut" [data]="browsers" xKey="browser" valueKey="visitors" [config]="browserConfig" label="Browsers" />
    </div>
  `,
})
export class ChartPage {
  readonly config: ChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };
  readonly rows = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];
  readonly browserConfig: ChartConfig = {
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
  };
  readonly browsers = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
  ];
}

@Component({
  selector: 'app-sidebar-page',
  imports: [UI_SIDEBAR, UI_CARD],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Sidebar</h1>
    <p class="mb-6 text-muted-foreground">Ctrl/Cmd+B toggles; under 768px it opens in a Sheet. Spec: docs/behavior-specs/sidebar.md</p>
    <div class="relative h-[26rem] overflow-hidden rounded-lg border" style="transform: translateZ(0)">
      <div uiSidebarProvider class="h-full min-h-0">
        <aside uiSidebar collapsible="icon">
          <div uiSidebarHeader>
            <ul uiSidebarMenu>
              <li uiSidebarMenuItem><a uiSidebarMenuButton size="lg" href="#" tooltip="Acme Inc"><span class="font-semibold">Acme Inc</span></a></li>
            </ul>
          </div>
          <div uiSidebarContent>
            <div uiSidebarGroup>
              <div uiSidebarGroupLabel>Platform</div>
              <div uiSidebarGroupContent>
                <ul uiSidebarMenu>
                  @for (item of items; track item) {
                    <li uiSidebarMenuItem>
                      <a uiSidebarMenuButton href="#" [isActive]="item === active()" [tooltip]="item" (click)="active.set(item); $event.preventDefault()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /></svg>
                        <span>{{ item }}</span>
                      </a>
                      @if (item === 'Projects') {
                        <span uiSidebarMenuBadge>12</span>
                      }
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
          <div uiSidebarFooter>
            <ul uiSidebarMenu><li uiSidebarMenuItem><button uiSidebarMenuButton tooltip="Account"><span>Account</span></button></li></ul>
          </div>
          <button uiSidebarRail></button>
        </aside>
        <main uiSidebarInset class="p-4">
          <header class="mb-4 flex items-center gap-2">
            <button uiSidebarTrigger></button>
            <span class="text-sm font-medium">{{ active() }}</span>
          </header>
          <div class="text-sm text-muted-foreground">Content area for {{ active() }}.</div>
        </main>
      </div>
    </div>
  `,
})
export class SidebarPage {
  readonly items = ['Dashboard', 'Projects', 'Team', 'Settings'];
  readonly active = signal('Dashboard');
}
