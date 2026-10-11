import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UI_AVATAR } from '@loomui/ui/avatar';
import { UiBadge } from '@loomui/ui/badge';
import { UiButton } from '@loomui/ui/button';
import { UI_CALENDAR } from '@loomui/ui/calendar';
import { UI_CARD } from '@loomui/ui/card';
import { UI_CHART, type ChartConfig } from '@loomui/ui/chart';
import { UiCheckbox } from '@loomui/ui/checkbox';
import { UI_DIALOG } from '@loomui/ui/dialog';
import { UiInput } from '@loomui/ui/input';
import { UiProgress } from '@loomui/ui/progress';
import { UI_SLIDER } from '@loomui/ui/slider';
import { UiSwitch } from '@loomui/ui/switch';
import { UiToastService } from '@loomui/ui/toast';
import '../icons';
import { AppState } from '../app-state';
import { CATEGORIES, COMPONENTS, type Category } from '../components.data';
import { FX } from '../fx';
import { ComponentOfDay } from './component-of-day';
import { CompareSlider } from './compare-slider';
import { FormBuilder } from './form-builder';
import { LayersStack } from './layers-stack';
import { TypedCode } from './typed-code';
import { UiIcon } from '@loomui/ui/icon';

@Component({
  selector: 'app-landing',
  imports: [UiIcon, RouterLink, UiButton, UiBadge, UI_CARD, UiSwitch, UiCheckbox, UiInput, UI_SLIDER, UiProgress, UI_AVATAR, UI_DIALOG, UI_CALENDAR, UI_CHART, FX, UiIcon, TypedCode, LayersStack, FormBuilder, CompareSlider, ComponentOfDay],
  template: `
    <main>
      <!-- ============ Hero ============ -->
      <section appSpotlight class="relative isolate overflow-hidden">
        <div class="pointer-events-none absolute inset-0 -z-30 overflow-hidden" aria-hidden="true"><div class="mesh-blob mesh-1"></div><div class="mesh-blob mesh-2"></div><div class="mesh-blob mesh-3"></div></div>
        <div class="hero-grid pointer-events-none absolute inset-0 -z-20" aria-hidden="true"></div>
        <div class="hero-spot pointer-events-none absolute left-0 top-0 -z-10" data-spot aria-hidden="true"></div>

        <!-- floating, draggable real components (large screens) -->
        <div class="pointer-events-none absolute inset-0 mx-auto hidden max-w-7xl lg:block" aria-hidden="false">
          <div appDraggable class="pointer-events-auto absolute start-2 top-24 w-60 cursor-grab xl:start-10">
            <div class="floaty glow-card rounded-xl border bg-card p-4 shadow-lg">
              <p class="mb-3 text-sm font-medium">Quick settings</p>
              <label class="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                Dark effects <button uiSwitch size="sm" [(checked)]="fx" aria-label="Dark effects"></button>
              </label>
              <span uiSlider [(value)]="vol" aria-label="Volume" class="w-full"></span>
              <p class="mt-2 text-[11px] text-muted-foreground tabular-nums">Volume {{ vol()[0] }}%</p>
            </div>
          </div>

          <div appDraggable class="pointer-events-auto absolute start-6 top-[26rem] w-56 cursor-grab xl:start-24">
            <div class="floaty glow-card rounded-xl border bg-card p-4 shadow-lg [animation-delay:-3s]">
              <p class="mb-2 text-sm font-medium">Notify me</p>
              <div class="flex gap-2">
                <button uiButton size="sm" (click)="toast.success('Saved', { description: 'That felt good.' })">Success</button>
                <button uiButton size="sm" variant="outline" (click)="toast.info('Psst — try dragging me')">Info</button>
              </div>
            </div>
          </div>

          <div appDraggable class="pointer-events-auto absolute end-2 top-28 w-60 cursor-grab xl:end-10">
            <div class="floaty glow-card rounded-xl border bg-card p-4 shadow-lg [animation-delay:-5s]">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-sm font-medium">Upload</p>
                <span uiBadge variant="secondary">{{ progress() }}%</span>
              </div>
              <div uiProgress [value]="progress()" class="mb-3"></div>
              <div uiAvatarGroup>
                <span uiAvatar><span uiAvatarFallback>AK</span></span>
                <span uiAvatar><span uiAvatarFallback>HR</span></span>
                <span uiAvatar><span uiAvatarFallback>MJ</span></span>
              </div>
            </div>
          </div>

          <div appDraggable class="pointer-events-auto absolute end-6 top-[27rem] w-56 cursor-grab xl:end-24">
            <div class="floaty glow-card rounded-xl border bg-card p-4 shadow-lg [animation-delay:-1.5s]">
              <p class="mb-2 text-sm font-medium">Delete project?</p>
              <div uiDialog class="contents">
                <button uiButton size="sm" variant="destructive" uiDialogTrigger>Delete…</button>
                <div uiDialogContent>
                  <div uiDialogHeader>
                    <h2 uiDialogTitle>Are you sure?</h2>
                    <p uiDialogDescription>This is a real dialog — focus is trapped, Esc closes, focus returns here.</p>
                  </div>
                  <div uiDialogFooter>
                    <button uiButton variant="outline" uiDialogClose>Cancel</button>
                    <button uiButton variant="destructive" uiDialogClose (click)="toast.error('Deleted (not really)')">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 pt-20 pb-14 text-center md:pt-28 md:pb-20">
          <a
            routerLink="/components"
            class="rise group inline-flex items-center gap-2 rounded-full border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <span class="relative flex size-2"><span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60"></span><span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span></span>
            {{ ready }} components ready
            <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">→</span>
          </a>
          <h1 class="rise text-4xl leading-[1.05] font-bold tracking-tight text-balance [animation-delay:60ms] md:text-7xl">
            Angular components, <span class="gradient-text">woven your way</span>
          </h1>
          <p class="rise max-w-2xl text-lg text-pretty text-muted-foreground [animation-delay:120ms] md:text-xl">
            Beautifully designed, accessible components. Standalone, signal-based and built on the CDK. Copy them into your app and own
            the code, or install the package — every component is a directive <em>and</em> a custom element.
          </p>
          <div class="rise flex flex-wrap justify-center gap-3 [animation-delay:180ms]">
            <a uiButton size="lg" routerLink="/components">Browse components</a>
            <button uiButton size="lg" variant="outline" (click)="state.palette.set(true)">
              Search <kbd class="ms-1 rounded border bg-background px-1.5 font-mono text-[10px]">{{ mod }}K</kbd>
            </button>
          </div>
          <dl class="rise mt-2 grid grid-cols-3 gap-8 text-center [animation-delay:240ms] md:gap-14">
            @for (s of stats; track s.label) {
              <div class="flex flex-col-reverse">
                <dt class="text-xs tracking-wide text-muted-foreground uppercase">{{ s.label }}</dt>
                <dd class="text-2xl font-bold tracking-tight md:text-3xl">{{ s.value }}</dd>
              </div>
            }
          </dl>
          <p class="hidden text-xs text-muted-foreground lg:block">Psst — the cards beside the headline are real components. Drag them around.</p>
        </div>
      </section>

      <!-- ============ Marquee ============ -->
      <section aria-label="A glimpse of the components" class="relative border-y bg-muted/20 py-8">
        <div class="marquee" aria-hidden="true" inert>
          <div class="marquee-track">
            @for (i of [0, 1]; track i) {
              <div class="flex gap-4 pe-4">
                <button uiButton>Button</button>
                <span class="flex items-center gap-2 rounded-xl border bg-card px-4"><button uiSwitch [checked]="true" tabindex="-1"></button><span class="text-sm">Switch</span></span>
                <span class="flex items-center gap-1.5"><span uiBadge>New</span><span uiBadge variant="secondary">Beta</span><span uiBadge variant="outline">v0.1</span></span>
                <span class="flex w-44 items-center rounded-xl border bg-card px-4"><div uiProgress [value]="64"></div></span>
                <input uiInput class="w-40" placeholder="Input" tabindex="-1" />
                <span class="flex items-center gap-2 rounded-xl border bg-card px-4"><button uiCheckbox [checked]="true" tabindex="-1"></button><span class="text-sm">Checkbox</span></span>
                <button uiButton variant="outline">Outline</button>
                <span uiAvatarGroup class="rounded-xl border bg-card px-3"><span uiAvatar><span uiAvatarFallback>UI</span></span><span uiAvatar><span uiAvatarFallback>NG</span></span></span>
                <button uiButton variant="secondary">Secondary</button>
                <span class="flex items-center gap-1.5 rounded-xl border bg-card px-4 text-sm text-muted-foreground"><kbd class="rounded border bg-background px-1.5 font-mono text-xs">Ctrl</kbd><kbd class="rounded border bg-background px-1.5 font-mono text-xs">K</kbd></span>
                <button uiButton variant="ghost">Ghost</button>
                <button uiButton variant="destructive">Destructive</button>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ============ Typed code ============ -->
      <section class="mx-auto max-w-6xl px-4 pt-20" aria-labelledby="typed-title">
        <div appReveal class="mb-8 text-center">
          <h2 id="typed-title" class="text-2xl font-semibold tracking-tight md:text-4xl">Write this, get that</h2>
          <p class="mt-2 text-muted-foreground">Every component is also a custom element. Describe the UI in markup and it renders — no wrappers, no setup.</p>
        </div>
        <div appReveal="80"><app-typed-code /></div>
      </section>

      <!-- ============ Bento ============ -->
      <section class="mx-auto max-w-6xl px-4 py-20" aria-labelledby="live-title">
        <div appReveal class="mb-10 text-center">
          <h2 id="live-title" class="text-2xl font-semibold tracking-tight md:text-4xl">Try them right here</h2>
          <p class="mt-2 text-muted-foreground">Real components, real state. Click, tab through them, switch accent, dark mode or RTL.</p>
        </div>
        <div class="grid gap-4 md:auto-rows-min md:grid-cols-4">
          <div appReveal appTilt="3" class="tilt glow-card flex flex-col rounded-2xl border bg-card p-5 md:col-span-2 md:row-span-2">
            <h3 class="font-medium">Calendar</h3>
            <p class="mb-4 text-sm text-muted-foreground">Single, multiple or range — fully keyboard driven.</p>
            <div class="flex flex-1 items-center justify-center">
              <div uiCalendar mode="single" [(selected)]="date" class="rounded-xl border"></div>
            </div>
          </div>

          <div appReveal="80" appTilt="3" class="tilt glow-card rounded-2xl border bg-card p-5 md:col-span-2">
            <h3 class="font-medium">Buttons, badges &amp; toasts</h3>
            <p class="mb-4 text-sm text-muted-foreground">Six variants, four sizes, Sonner-style notifications.</p>
            <div class="flex flex-wrap gap-2">
              <button uiButton (click)="toast.success('Saved', { description: 'Your changes are live.' })">Success</button>
              <button uiButton variant="secondary" (click)="toast.info('Heads up')">Info</button>
              <button uiButton variant="outline" (click)="toast.warning('Careful now')">Warn</button>
              <button uiButton variant="destructive" (click)="toast.error('Something broke')">Error</button>
              <button uiButton variant="ghost">Ghost</button>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <span uiBadge>Badge</span><span uiBadge variant="secondary">Secondary</span><span uiBadge variant="outline">Outline</span><span uiBadge variant="destructive">Destructive</span>
            </div>
          </div>

          <div appReveal="140" appTilt="3" class="tilt glow-card rounded-2xl border bg-card p-5 md:col-span-2">
            <h3 class="font-medium">Preferences</h3>
            <p class="mb-4 text-sm text-muted-foreground">Form controls with real state.</p>
            <div class="flex flex-col gap-3">
              <input uiInput placeholder="Your name" aria-label="Your name" />
              <label class="flex items-center justify-between text-sm font-medium">
                Email notifications <button uiSwitch [(checked)]="notify" aria-label="Email notifications"></button>
              </label>
              <label class="flex items-center gap-2 text-sm"><button uiCheckbox [(checked)]="terms" aria-label="Accept terms"></button> I agree to the terms</label>
              <p class="text-xs text-muted-foreground" aria-live="polite">Notifications {{ notify() ? 'on' : 'off' }} · terms {{ terms() ? 'accepted' : 'pending' }}</p>
            </div>
          </div>

          <div appReveal appTilt="3" class="tilt glow-card rounded-2xl border bg-card p-5 md:col-span-2">
            <h3 class="font-medium">Charts</h3>
            <p class="mb-2 text-sm text-muted-foreground">Uses your accent color.</p>
            <ui-chart type="bar" [data]="rows" xKey="m" [config]="config" class="h-52 w-full !aspect-auto" label="Visitors per month" />
          </div>

          <div appReveal="80" appTilt="3" class="tilt glow-card rounded-2xl border bg-card p-5">
            <h3 class="font-medium">Accent</h3>
            <p class="mb-4 text-sm text-muted-foreground">Live theming.</p>
            <div class="flex flex-wrap gap-2" role="group" aria-label="Accent color">
              @for (a of state.accents; track a.id) {
                <button
                  type="button"
                  class="size-7 rounded-full ring-offset-2 ring-offset-card transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  [class]="state.accent() === a.id ? 'ring-2 ring-foreground' : ''"
                  [style.background]="a.color"
                  [attr.aria-label]="a.label"
                  [attr.aria-pressed]="state.accent() === a.id"
                  (click)="state.setAccent(a.id)"
                ></button>
              }
            </div>
            <button uiButton variant="outline" size="sm" class="mt-4" (click)="state.toggleDark($event)">{{ state.dark() ? 'Light' : 'Dark' }} mode</button>
          </div>

          <button
            appReveal="140"
            appTilt="3"
            type="button"
            (click)="state.palette.set(true)"
            class="tilt glow-card flex flex-col items-start rounded-2xl border bg-card p-5 text-start focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <h3 class="font-medium">Command palette</h3>
            <p class="mb-4 text-sm text-muted-foreground">Jump anywhere, instantly.</p>
            <span class="mt-auto flex w-full items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Search… <kbd class="ms-auto rounded border bg-background px-1.5 font-mono text-[10px]">{{ mod }}K</kbd>
            </span>
          </button>
        </div>
      </section>

      <!-- ============ Light | Dark ============ -->
      <section class="mx-auto max-w-5xl px-4 pb-20" aria-labelledby="compare-title">
        <div appReveal class="mb-8 text-center">
          <h2 id="compare-title" class="text-2xl font-semibold tracking-tight md:text-4xl">Light, dark — and everything between</h2>
          <p class="mt-2 text-muted-foreground">The same components, themed by CSS variables. Drag the handle (or use the arrow keys).</p>
        </div>
        <div appReveal="80"><app-compare-slider /></div>
        <p class="mt-4 text-center text-sm text-muted-foreground">
          More accents on the <a routerLink="/themes" class="font-medium text-foreground underline-offset-4 hover:underline">Themes</a> page.
        </p>
      </section>

      <!-- ============ Layers ============ -->
      <section class="border-y bg-muted/20" aria-labelledby="layers-title">
        <div class="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <div appReveal>
            <h2 id="layers-title" class="text-2xl font-semibold tracking-tight md:text-4xl">Layers that behave</h2>
            <p class="mt-3 max-w-md text-muted-foreground">
              Dialogs, menus, popovers and toasts sit on the CDK overlay: focus is trapped and returned, Esc closes, scroll is locked, and the page behind is hidden from
              assistive tech. Hover the stack to fan the layers out.
            </p>
            <ul class="mt-6 grid gap-2 text-sm">
              @for (p of layerPoints; track p) {
                <li class="flex items-start gap-2"><ui-icon name="check" class="mt-0.5 text-emerald-500" /> {{ p }}</li>
              }
            </ul>
          </div>
          <div appReveal="100"><app-layers-stack /></div>
        </div>
      </section>

      <!-- ============ Form builder ============ -->
      <section class="mx-auto max-w-6xl px-4 py-20" aria-labelledby="builder-title">
        <div appReveal class="mb-8 text-center">
          <h2 id="builder-title" class="text-2xl font-semibold tracking-tight md:text-4xl">Build a form in seconds</h2>
          <p class="mt-2 text-muted-foreground">Click or drag fields in. The preview is made of real components and the Angular code writes itself.</p>
        </div>
        <div appReveal="80"><app-form-builder /></div>
      </section>

      <!-- ============ Component of the day ============ -->
      <section class="mx-auto max-w-6xl px-4 pb-20" aria-labelledby="day-title">
        <div appReveal class="mb-6">
          <h2 id="day-title" class="text-2xl font-semibold tracking-tight md:text-3xl">Today's pick</h2>
          <p class="mt-1 text-muted-foreground">A different component each day, running live.</p>
        </div>
        <div appReveal="80"><app-component-of-day /></div>
      </section>

      <!-- ============ Features ============ -->
      <section class="border-y bg-muted/30">
        <div class="mx-auto max-w-6xl px-4 py-16">
          <h2 appReveal class="mb-8 text-center text-2xl font-semibold tracking-tight md:text-3xl">Built the way you would build it</h2>
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            @for (f of features; track f.title; let i = $index) {
              <li [appReveal]="i * 60" appTilt="4" class="tilt group rounded-xl bg-card p-5 text-card-foreground ring-1 ring-foreground/10 hover:shadow-md hover:ring-foreground/20">
                <span class="mb-3 grid size-9 place-items-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-cyan-400/15 text-indigo-600 dark:text-indigo-300">
                  <ui-icon [name]="f.icon" class="size-[18px]" />
                </span>
                <h3 class="mb-1 font-medium">{{ f.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ f.text }}</p>
              </li>
            }
          </ul>
        </div>
      </section>

      <!-- ============ Gallery ============ -->
      <section class="mx-auto max-w-6xl px-4 py-16" aria-labelledby="gallery-title">
        <div appReveal class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="gallery-title" class="text-2xl font-semibold tracking-tight md:text-3xl">All {{ total }} components</h2>
            <p class="mt-1 text-muted-foreground">Every page has a live demo, a behavior spec and a manual test checklist.</p>
          </div>
          <label class="relative block md:w-72">
            <span class="sr-only">Search components</span>
            <ui-icon name="search" class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input uiInput class="ps-9" type="search" placeholder="Search components…" [value]="query()" (input)="query.set($any($event.target).value)" />
          </label>
        </div>

        <div class="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button type="button" [class]="chip(category() === null)" [attr.aria-pressed]="category() === null" (click)="category.set(null)">All</button>
          @for (c of categories; track c) {
            <button type="button" [class]="chip(category() === c)" [attr.aria-pressed]="category() === c" (click)="category.set(c)">{{ c }}</button>
          }
        </div>

        @if (filtered().length) {
          <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (c of filtered(); track c.slug) {
              <li>
                <a
                  [routerLink]="['/components', c.slug]"
                  appTilt="5"
                  class="tilt group flex h-full flex-col gap-1 rounded-xl border bg-card p-4 hover:border-foreground/25 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span class="flex items-center justify-between gap-2">
                    <span class="flex items-center gap-2 font-medium">{{ c.name }} @if (c.isNew) { <span class="badge-new rounded-full px-1.5 py-px text-[9px] font-semibold tracking-wide text-white uppercase">new</span> }</span>
                    <span aria-hidden="true" class="text-muted-foreground transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">→</span>
                  </span>
                  <span class="text-sm text-muted-foreground">{{ c.blurb }}</span>
                  <span class="mt-2 text-[11px] tracking-wide text-muted-foreground/80 uppercase">{{ c.category }}</span>
                </a>
              </li>
            }
          </ul>
        } @else {
          <p class="rounded-xl border border-dashed p-10 text-center text-muted-foreground">No component matches “{{ query() }}”.</p>
        }
      </section>
    </main>

    <footer class="border-t">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>Loom UI · standalone · signals · CDK. An independent project inspired by <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:text-foreground">shadcn/ui</a> (MIT) — not affiliated.</p>
        <p>Specs &amp; manual checklists live in <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/docs</code>.</p>
      </div>
    </footer>
  `,
})
export class LandingPage {
  protected readonly toast = inject(UiToastService);
  protected readonly state = inject(AppState);
  readonly mod = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl ';
  readonly categories = CATEGORIES;
  readonly total = COMPONENTS.length;
  readonly ready = COMPONENTS.filter((c) => c.status === 'ready').length;

  readonly fx = signal(true);
  readonly vol = signal([60]);
  readonly progress = signal(64);
  readonly notify = signal(true);
  readonly terms = signal(false);
  readonly date = signal<Date | undefined>(new Date());
  readonly query = signal('');
  readonly category = signal<Category | null>(null);

  readonly config: ChartConfig = {
    a: { label: 'Desktop', color: 'var(--chart-2)' },
    b: { label: 'Mobile', color: 'var(--chart-4)' },
  };
  readonly rows = [
    { m: 'Jan', a: 186, b: 80 },
    { m: 'Feb', a: 305, b: 200 },
    { m: 'Mar', a: 237, b: 120 },
    { m: 'Apr', a: 173, b: 190 },
    { m: 'May', a: 209, b: 130 },
    { m: 'Jun', a: 264, b: 160 },
  ];

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    return COMPONENTS.filter(
      (c) => (!cat || c.category === cat) && (!q || c.name.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q)),
    );
  });

  readonly stats = [
    { value: String(COMPONENTS.length), label: 'Components' },
    { value: '100%', label: 'Standalone' },
    { value: 'RTL', label: '+ dark mode' },
  ];

  constructor() {
    if (typeof matchMedia !== 'undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = setInterval(() => this.progress.update((p) => (p >= 100 ? 8 : Math.min(100, p + 7))), 1100);
      inject(DestroyRef).onDestroy(() => clearInterval(id));
    }
  }

  chip(active: boolean): string {
    return (
      'rounded-full border px-3 py-1 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ' +
      (active ? 'border-transparent bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')
    );
  }

  readonly layerPoints = [
    'Focus trap with focus return to the trigger',
    'Escape and outside-click dismissal, per component rules',
    'Scroll lock and aria-hidden on the page behind',
    'Enter/exit animation hooks via data-state',
  ];

  readonly features = [
    { title: 'Directive-first', text: 'Native elements keep their semantics: <button uiButton>, <div uiDialog>.', icon: 'code-xml' },
    { title: 'Same variants', text: 'class-variance-authority + tailwind-merge with familiar variant names (default, outline, secondary…) and defaults.', icon: 'sliders-horizontal' },
    { title: 'Tailwind v4 tokens', text: 'Uses --background, --primary, --radius and the .dark class unchanged.', icon: 'palette' },
    { title: 'CDK underneath', text: 'Overlay, FocusTrap and key managers replace Radix primitives.', icon: 'layers' },
    { title: 'RTL ready', text: 'Logical properties (ms-/me-/ps-/pe-) and mirrored keyboard behavior.', icon: 'languages' },
    { title: 'Evidence-backed', text: 'Each component has a behavior spec and a manual test checklist.', icon: 'badge-check' },
  ];
}
