import { embedUrl } from '../embed-url';
import { afterNextRender, Component, computed, DestroyRef, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiSkeleton } from '@loomui-ng/ui/skeleton';
import { filter } from 'rxjs';
import { UiInput } from '@loomui-ng/ui/input';
import { UI_TABS } from '@loomui-ng/ui/tabs';
import { CATEGORIES, COMPONENTS, type Category } from '../components.data';
import '../icons';
import { DOCS } from '../docs.generated';
import { toElements } from '../to-elements';
import { CodeCard, type CodeTab } from './code-card';
import { Playground, PLAYGROUNDS } from './playgrounds';
import { UiIcon } from '@loomui-ng/ui/icon';

const ICONS: Record<Category, string> = {
  'Forms & input': 'pencil-line',
  'Overlays & menus': 'layers',
  Display: 'eye',
  Navigation: 'compass',
  Feedback: 'bell',
  Layout: 'layout-grid',
  'Data & charts': 'chart-column',
  'Chat & AI': 'message-square',
};

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const readViewed = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('loom-viewed') ?? '[]');
  } catch {
    return [];
  }
};

@Component({
  selector: 'app-components-layout',
  imports: [UiIcon, RouterOutlet, RouterLink, RouterLinkActive, UiInput, UI_TABS, CodeCard, Playground, UiIcon, UiSkeleton],
  template: `
    <div class="mx-auto flex max-w-[90rem] gap-8 px-4 py-6 md:py-8">
      <!-- ============ left: navigation ============ -->
      <aside class="hidden w-56 shrink-0 md:block">
        <nav aria-label="Components" class="sticky top-20 flex max-h-[calc(100svh-6rem)] flex-col gap-3">
          <div class="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5">
            <svg class="size-10 shrink-0 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="3" class="text-muted" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-primary transition-[stroke-dasharray] duration-700" [attr.stroke-dasharray]="ring()" />
            </svg>
            <div class="text-xs leading-tight">
              <p class="font-medium">{{ viewedCount() }} / {{ total }} explored</p>
              <p class="text-muted-foreground">Visit them all</p>
            </div>
          </div>
          <label class="relative block">
            <span class="sr-only">Filter components</span>
            <ui-icon name="search" class="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input uiInput type="search" class="ps-8" placeholder="Filter…" [value]="query()" (input)="query.set($any($event.target).value)" />
          </label>
          <div class="-me-2 flex flex-col gap-5 overflow-y-auto pe-2 pb-6">
            @for (g of groups(); track g.category) {
              <div>
                <h2 class="mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  <ui-icon [name]="icons[g.category]" class="size-3.5" />
                  {{ g.category }}
                </h2>
                <ul class="flex flex-col gap-px border-s">
                  @for (c of g.items; track c.slug) {
                    <li>
                      <a
                        [routerLink]="c.slug"
                        routerLinkActive="!border-primary !text-foreground font-medium bg-muted/60"
                        class="-ms-px flex items-center justify-between gap-2 border-s border-transparent px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        <span class="flex items-center gap-1.5">
                          {{ c.name }}
                          @if (c.isNew) {
                            <span class="badge-new rounded-full px-1.5 py-px text-[9px] leading-none font-semibold tracking-wide text-white uppercase">new</span>
                          }
                        </span>
                        @if (viewed().has(c.slug)) {
                          <ui-icon name="check" class="size-3 text-emerald-500" strokeWidth="3" label="Visited" />
                        }
                      </a>
                    </li>
                  }
                </ul>
              </div>
            } @empty {
              <p class="px-2 text-sm text-muted-foreground">No match.</p>
            }
          </div>
        </nav>
      </aside>

      <!-- ============ center ============ -->
      <div class="min-w-0 flex-1">
        <label class="mb-4 block md:hidden">
          <span class="sr-only">Choose component</span>
          <select class="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm" (change)="go($any($event.target).value)">
            @for (c of components; track c.slug) {
              <option [value]="c.slug" [selected]="c.slug === current()">{{ c.name }}</option>
            }
          </select>
        </label>

        <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <a routerLink="/components" class="transition-colors hover:text-foreground">Components</a>
          <span aria-hidden="true" class="rtl:rotate-180">›</span>
          <span class="text-muted-foreground/80">{{ entry()?.category }}</span>
          <span aria-hidden="true" class="rtl:rotate-180">›</span>
          <span class="font-medium text-foreground" aria-current="page">{{ entry()?.name }}</span>
        </nav>

        <div uiTabs [(value)]="view" class="gap-4">
          <div class="flex items-center justify-between gap-3">
            <div uiTabsList aria-label="View">
              <button uiTabsTrigger value="preview">Preview</button>
              @if (hasPlayground()) {
                <button uiTabsTrigger value="playground">Playground</button>
              }
              <button uiTabsTrigger value="code">Code</button>
            </div>
            @if (entry(); as e) {
              <span class="hidden text-sm text-muted-foreground sm:block">{{ e.blurb }}</span>
            }
          </div>

          <!-- Preview -->
          <div uiTabsContent value="preview" class="text-base">
            <div class="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Preview size">
              @for (m of modes; track m.label) {
                <button
                  type="button"
                  class="inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  [class]="mode() === m.label ? 'border-transparent bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
                  [attr.aria-pressed]="mode() === m.label"
                  (click)="setMode(m.width)"
                >
                  <ui-icon [name]="m.icon" class="size-3.5" />
                  {{ m.label }}
                </button>
              }
              @if (width() !== null) {
                <span class="font-mono text-xs text-muted-foreground tabular-nums" aria-live="polite">{{ width() }}px</span>
              }
              <a [href]="embedHref()" target="_blank" rel="noreferrer" class="ms-auto text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">Open standalone ↗︎</a>
            </div>

            <div #frame class="relative max-w-full" [style.width.px]="width()">
              <!-- fit mode: the real routed demo -->
              <div #stage class="demo-stage rise min-w-0 rounded-2xl border bg-card/50 p-5 shadow-xs md:p-8" [class.hidden]="width() !== null">
                <router-outlet />
              </div>
              @if (loading()) {
                <div class="absolute inset-0 z-10 grid content-start gap-4 rounded-2xl border bg-background p-5 md:p-8" role="status" aria-label="Loading demo">
                  <ui-skeleton class="h-8 w-48" />
                  <ui-skeleton class="h-4 w-80 max-w-full" />
                  <div class="mt-4 grid gap-3">
                    <ui-skeleton class="h-24 w-full" />
                    <div class="grid grid-cols-3 gap-3"><ui-skeleton class="h-10" /><ui-skeleton class="h-10" /><ui-skeleton class="h-10" /></div>
                  </div>
                </div>
              }
              <!-- sized mode: the same demo in an iframe so breakpoints respond to the chosen width -->
              @if (width() !== null && embedSrc(); as src) {
                <div class="overflow-hidden rounded-2xl border bg-background shadow-xs">
                  <iframe [src]="src" [title]="(entry()?.name ?? '') + ' preview at ' + width() + 'px'" class="block w-full" [style.height.px]="iframeH()"></iframe>
                </div>
              }
              @if (width() !== null) {
                <div
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize preview"
                  tabindex="0"
                  class="absolute inset-y-0 -end-3 flex w-3 cursor-col-resize touch-none items-center justify-center rounded-e-full text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  (pointerdown)="dragStart($event, frame)"
                  (pointermove)="dragMove($event)"
                  (pointerup)="dragEnd($event)"
                  (keydown)="dragKey($event)"
                >
                  <span class="h-10 w-1 rounded-full bg-border"></span>
                </div>
              }
            </div>
          </div>

          <!-- Playground -->
          @if (hasPlayground()) {
            <div uiTabsContent value="playground" class="text-base">
              <app-playground [slug]="current()" />
            </div>
          }

          <!-- Code -->
          <div uiTabsContent value="code" class="text-base">
            @if (codeTabs().length) {
              <app-code-card label="Code examples" [tabs]="codeTabs()" />
            }
          </div>
        </div>

        @if (docs(); as d) {
          @if (d.api.length || d.parts.length) {
            <section class="mt-10" aria-labelledby="api-title">
              <h2 id="api-title" class="mb-3 text-lg font-semibold tracking-tight">API reference</h2>
              @if (d.api.length) {
                <div class="overflow-x-auto rounded-xl border">
                  <table class="w-full text-start text-sm">
                    <thead class="bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                      <tr>
                        <th scope="col" class="px-4 py-2.5 text-start font-medium">Input / output</th>
                        <th scope="col" class="px-4 py-2.5 text-start font-medium">Type / values</th>
                        <th scope="col" class="px-4 py-2.5 text-start font-medium">Default</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      @for (r of d.api; track r[0]) {
                        <tr>
                          <td class="px-4 py-2.5 align-top"><code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{{ r[0] }}</code></td>
                          <td class="px-4 py-2.5 align-top font-mono text-xs text-muted-foreground">{{ r[1] }}</td>
                          <td class="px-4 py-2.5 align-top font-mono text-xs">{{ r[2] || '—' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
              @if (d.parts.length) {
                <p class="mt-3 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                  Parts:
                  @for (p of d.parts; track p) {
                    <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{{ p }}</code>
                  }
                </p>
              }
            </section>
          }
        }

        <nav aria-label="Previous and next component" class="mt-10 grid grid-cols-2 gap-3">
          @if (prev(); as p) {
            <a [routerLink]="p.slug" class="group flex flex-col rounded-xl border p-4 transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <span class="text-xs text-muted-foreground">← Previous</span>
              <span class="font-medium">{{ p.name }}</span>
            </a>
          } @else {
            <span></span>
          }
          @if (next(); as n) {
            <a [routerLink]="n.slug" class="group flex flex-col items-end rounded-xl border p-4 text-end transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <span class="text-xs text-muted-foreground">Next →</span>
              <span class="font-medium">{{ n.name }}</span>
            </a>
          }
        </nav>
      </div>

      <!-- ============ right: on this page ============ -->
      <aside class="hidden w-48 shrink-0 xl:block">
        @if (toc().length && view() === 'preview' && width() === null) {
          <nav aria-label="On this page" class="sticky top-20 text-sm">
            <h2 class="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">On this page</h2>
            <ul class="flex flex-col gap-px border-s">
              @for (t of toc(); track t.id) {
                <li>
                  <a
                    [href]="'#' + t.id"
                    class="-ms-px block border-s border-transparent py-1 text-muted-foreground transition-colors hover:text-foreground"
                    [class]="(t.level > 2 ? 'ps-6 text-xs ' : 'ps-3 ') + (activeId() === t.id ? '!border-primary !text-foreground font-medium' : '')"
                    (click)="jump(t.id, $event)"
                    >{{ t.text }}</a
                  >
                </li>
              }
            </ul>
          </nav>
        }
      </aside>
    </div>
  `,
})
export class ComponentsLayout {
  readonly components = COMPONENTS;
  readonly icons = ICONS;
  readonly total = COMPONENTS.length;
  readonly query = signal('');
  readonly view = signal('preview');
  /** True when a demo chunk takes longer than ~120 ms to arrive (avoids a flash on fast loads). */
  readonly loading = signal(false);
  private loadingTimer: ReturnType<typeof setTimeout> | undefined;

  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');

  readonly current = signal(this.slugFrom(this.router.url));
  readonly entry = computed(() => COMPONENTS.find((c) => c.slug === this.current()));
  private readonly index = computed(() => COMPONENTS.findIndex((c) => c.slug === this.current()));
  readonly prev = computed(() => (this.index() > 0 ? COMPONENTS[this.index() - 1] : null));
  readonly next = computed(() => (this.index() >= 0 && this.index() < COMPONENTS.length - 1 ? COMPONENTS[this.index() + 1] : null));
  readonly docs = computed(() => DOCS[this.current()] ?? null);
  readonly hasPlayground = computed(() => !!PLAYGROUNDS[this.current()]);

  readonly groups = computed(() => {
    const q = this.query().trim().toLowerCase();
    return CATEGORIES.map((category) => ({
      category,
      items: COMPONENTS.filter((c) => c.category === category && (!q || c.name.toLowerCase().includes(q))),
    })).filter((g) => g.items.length);
  });

  /* ----- explored progress ----- */
  readonly viewed = signal(new Set<string>(readViewed()));
  readonly viewedCount = computed(() => this.viewed().size);
  readonly ring = computed(() => {
    const c = 2 * Math.PI * 15;
    return `${(this.viewedCount() / this.total) * c} ${c}`;
  });

  /* ----- code tabs ----- */
  readonly codeTabs = computed<CodeTab[]>(() => {
    const d = this.docs();
    const slug = this.current();
    if (!d) return [];
    const tabs: CodeTab[] = [];
    if (d.usage) {
      tabs.push({ label: 'Directive', file: `${slug}.directive.html`, code: d.usage });
      const el = toElements(d.usage);
      if (el !== d.usage) tabs.push({ label: 'Element', file: `${slug}.element.html`, code: el });
    }
    if (d.importLine) tabs.push({ label: 'Import', file: `${slug}.component.ts`, code: d.importLine });
    tabs.push({
      label: 'Install',
      file: 'terminal',
      code: `# copy the source into your project (you own the code)\nnpx loomui add ${slug}\n\n# or use the package\nnpm install @loomui-ng/ui`,
    });
    return tabs;
  });

  /* ----- resizable preview ----- */
  readonly modes = [
    { label: 'Fit', width: null as number | null, icon: 'monitor' },
    { label: 'Tablet', width: 768 as number | null, icon: 'tablet' },
    { label: 'Mobile', width: 375 as number | null, icon: 'smartphone' },
  ];
  readonly width = signal<number | null>(null);
  readonly mode = computed(() => {
    const w = this.width();
    return this.modes.find((m) => m.width === w)?.label ?? 'Custom';
  });
  readonly iframeH = signal(420);
  readonly embedHref = computed(() => (this.current() ? embedUrl(this.current()!) : '#'));
  readonly embedSrc = computed<SafeResourceUrl | null>(() =>
    this.current() ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl(this.current()!)) : null,
  );
  private drag: { x: number; w: number; sign: number; max: number } | null = null;

  setMode(w: number | null): void {
    this.width.set(w);
  }

  dragStart(e: PointerEvent, frame: HTMLElement): void {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const parentW = frame.parentElement?.getBoundingClientRect().width ?? 1200;
    this.drag = { x: e.clientX, w: frame.getBoundingClientRect().width, sign: document.documentElement.dir === 'rtl' ? -1 : 1, max: parentW };
  }
  dragMove(e: PointerEvent): void {
    if (!this.drag) return;
    const w = this.drag.w + (e.clientX - this.drag.x) * this.drag.sign;
    this.width.set(Math.round(Math.min(this.drag.max, Math.max(280, w))));
  }
  dragEnd(e: PointerEvent): void {
    this.drag = null;
    const t = e.currentTarget as HTMLElement;
    if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
  }
  dragKey(e: KeyboardEvent): void {
    const step = e.shiftKey ? 40 : 10;
    const sign = document.documentElement.dir === 'rtl' ? -1 : 1;
    const cur = this.width() ?? 0;
    if (e.key === 'ArrowRight') this.width.set(Math.max(280, cur + step * sign));
    else if (e.key === 'ArrowLeft') this.width.set(Math.max(280, cur - step * sign));
    else return;
    e.preventDefault();
  }

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent): void {
    const d = e.data as { type?: string; slug?: string; h?: number } | null;
    if (d?.type === 'loom-embed-height' && d.slug === this.current() && typeof d.h === 'number') this.iframeH.set(Math.max(240, d.h));
  }

  /* ----- on this page ----- */
  readonly toc = signal<TocItem[]>([]);
  readonly activeId = signal('');
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart && e.url.startsWith('/components/')) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = setTimeout(() => this.loading.set(true), 120);
      } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
        clearTimeout(this.loadingTimer);
        this.loading.set(false);
      }
    });
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const slug = this.slugFrom(e.urlAfterRedirects);
      this.current.set(slug);
      this.view.set('preview');
      this.width.set(null);
      this.toc.set([]);
      this.markViewed(slug);
    });
    this.markViewed(this.current());

    afterNextRender(() => {
      const stage = this.stage()?.nativeElement;
      if (!stage || typeof MutationObserver === 'undefined') return;
      let t: ReturnType<typeof setTimeout>;
      const mo = new MutationObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => this.scan(stage), 180);
      });
      mo.observe(stage, { childList: true, subtree: true });
      this.scan(stage);
      this.destroyRef.onDestroy(() => {
        mo.disconnect();
        this.observer?.disconnect();
        clearTimeout(t);
      });
    });
  }

  private markViewed(slug: string): void {
    if (this.viewed().has(slug)) return;
    this.viewed.update((s) => new Set(s).add(slug));
    try {
      localStorage.setItem('loom-viewed', JSON.stringify([...this.viewed()]));
    } catch {}
  }

  /**
   * Many demos stack several examples without titles. When a demo has fewer than two headings and a vertically stacked
   * container with 2–8 blocks, insert small "Example n" headings so the page gets anchors and an "On this page" list.
   */
  private ensureSections(stage: HTMLElement): void {
    if (stage.querySelector('h2, h3, .synthetic-heading')) return;
    const root = stage.querySelector('router-outlet')?.nextElementSibling as HTMLElement | null;
    if (!root) return;
    const kids = Array.from(root.children).filter((c) => !['H1', 'STYLE', 'SCRIPT'].includes(c.tagName)) as HTMLElement[];
    const body = kids.filter((c, i) => !(i === 0 && c.tagName === 'P'));
    const container = body.length === 1 && body[0].children.length >= 2 ? body[0] : root;
    const cs = getComputedStyle(container);
    const stacked = cs.display === 'block' || (cs.display === 'flex' && cs.flexDirection === 'column') || (cs.display === 'grid' && cs.gridTemplateColumns.split(' ').length === 1);
    if (!stacked) return;
    const blocks = Array.from(container.children).filter((c) => !['H1', 'STYLE', 'SCRIPT'].includes(c.tagName) && !(c === kids[0] && c.tagName === 'P') && (c as HTMLElement).offsetHeight > 24) as HTMLElement[];
    if (blocks.length < 2 || blocks.length > 8) return;
    blocks.forEach((b, i) => {
      const h = document.createElement('h2');
      h.className = 'synthetic-heading mb-2 text-sm font-medium text-muted-foreground';
      h.textContent = 'Example ' + (i + 1);
      b.before(h);
    });
  }

  /** Finds the demo's h2/h3 headings, gives them ids + hover anchor links, and tracks the active one. */
  private scan(stage: HTMLElement): void {
    this.ensureSections(stage);
    const heads = Array.from(stage.querySelectorAll<HTMLElement>('h2, h3')).filter((h) => !h.closest('[hidden]') && h.textContent?.trim());
    const used = new Set<string>();
    const items: TocItem[] = heads.map((h) => {
      let id = h.id || (h.textContent ?? '').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
      while (used.has(id)) id += '-2';
      used.add(id);
      h.id = id;
      h.classList.add('group');
      if (!h.querySelector('.anchor-link')) {
        const a = document.createElement('a');
        a.className = 'anchor-link';
        a.href = '#' + id;
        a.textContent = '#';
        a.setAttribute('aria-label', 'Link to section');
        a.addEventListener('click', (ev) => this.jump(id, ev));
        h.appendChild(a);
      }
      return { id, text: (h.firstChild?.textContent ?? h.textContent ?? '').trim(), level: h.tagName === 'H2' ? 2 : 3 };
    });
    const same = items.length === this.toc().length && items.every((x, i) => x.id === this.toc()[i].id);
    if (!same) this.toc.set(items);

    this.observer?.disconnect();
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) this.activeId.set((vis.target as HTMLElement).id);
      },
      { rootMargin: '-72px 0px -65% 0px' },
    );
    heads.forEach((h) => this.observer!.observe(h));
  }

  jump(id: string, e: Event): void {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    this.activeId.set(id);
  }

  private slugFrom(url: string): string {
    return url.split('/')[2]?.split('?')[0] ?? 'button';
  }

  go(slug: string) {
    this.router.navigate(['/components', slug]);
  }
}
