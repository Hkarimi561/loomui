import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { iconChildren, iconToSvg, toPascal, UiIcon, type IconNode } from '@loomui-ng/ui/icon';
import { UiInput } from '@loomui-ng/ui/input';
import { UiToastService } from '@loomui-ng/ui/toast';
import '../icons';
import { CodeCard, type CodeTab } from './code-card';

type CopyMode = 'name' | 'element' | 'import' | 'svg';
const MODES: { id: CopyMode; label: string; hint: string }[] = [
  { id: 'name', label: 'Name', hint: 'search' },
  { id: 'element', label: 'Element', hint: '<ui-icon … />' },
  { id: 'import', label: 'Import', hint: "import { Search } from 'lucide'" },
  { id: 'svg', label: 'SVG', hint: '<svg>…</svg>' },
];
const SWATCHES = [
  { id: 'current', label: 'Current text color', css: 'currentColor' },
  { id: 'primary', label: 'Primary', css: 'var(--primary)' },
  { id: 'rose', label: 'Rose', css: '#e11d48' },
  { id: 'emerald', label: 'Emerald', css: '#10b981' },
  { id: 'sky', label: 'Sky', css: '#0ea5e9' },
  { id: 'amber', label: 'Amber', css: '#f59e0b' },
];
const PAGE = 180;

const read = (k: string): string | null => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};

@Component({
  selector: 'app-icons-page',
  imports: [UiIcon, UiInput, CodeCard],
  template: `
    <div class="mx-auto max-w-[90rem] px-4 py-8 md:py-10">
      <header class="mb-6 flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Icons</h1>
        <p class="max-w-2xl text-muted-foreground">
          {{ total() ? total() + ' Lucide icons.' : 'Loading Lucide…' }} Click an icon to copy it in the format you choose, or open its details for ready-to-paste Angular code.
          Use them with <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;ui-icon&gt;</code> or <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;svg uiIcon&gt;</code>.
        </p>
      </header>

      <!-- toolbar -->
      <div class="sticky top-14 z-20 -mx-4 mb-5 flex flex-col gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur-md md:flex-row md:flex-wrap md:items-center">
        <label class="relative block md:w-80">
          <span class="sr-only">Search icons</span>
          <ui-icon name="search" class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input #search uiInput type="search" class="ps-9" placeholder="Search by name or tag…   (press /)" [value]="query()" (input)="setQuery($any($event.target).value)" />
        </label>

        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <label class="flex items-center gap-2">
            <span class="text-muted-foreground">Size</span>
            <input type="range" min="12" max="64" step="2" class="w-24 accent-[var(--primary)]" [value]="size()" (input)="size.set(+$any($event.target).value)" aria-label="Icon size" />
            <span class="w-8 font-mono tabular-nums">{{ size() }}px</span>
          </label>
          <label class="flex items-center gap-2">
            <span class="text-muted-foreground">Stroke</span>
            <input type="range" min="0.5" max="3" step="0.25" class="w-24 accent-[var(--primary)]" [value]="stroke()" (input)="stroke.set(+$any($event.target).value)" aria-label="Stroke width" />
            <span class="w-8 font-mono tabular-nums">{{ stroke() }}</span>
          </label>
          <div class="flex items-center gap-1.5" role="group" aria-label="Icon color">
            @for (c of swatches; track c.id) {
              <button
                type="button"
                class="size-5 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                [class]="color() === c.css ? 'ring-2 ring-foreground' : 'border'"
                [style.background]="c.id === 'current' ? 'linear-gradient(135deg, var(--foreground) 50%, var(--background) 50%)' : c.css"
                [attr.aria-label]="c.label"
                [attr.aria-pressed]="color() === c.css"
                (click)="color.set(c.css)"
              ></button>
            }
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs md:ms-auto" role="group" aria-label="Click to copy as">
          <span class="text-muted-foreground">Click copies</span>
          <div class="flex rounded-lg border p-0.5">
            @for (m of modes; track m.id) {
              <button
                type="button"
                class="rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                [class]="mode() === m.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'"
                [attr.aria-pressed]="mode() === m.id"
                [title]="m.hint"
                (click)="setMode(m.id)"
              >
                {{ m.label }}
              </button>
            }
          </div>
        </div>
      </div>

      <div class="flex gap-6">
        <!-- grid -->
        <div class="min-w-0 flex-1" [style.--ls.px]="size()" [style.--lw]="stroke()" [style.color]="color()">
          @if (loading()) {
            <div class="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2" aria-busy="true">
              @for (i of skeletons; track i) {
                <div class="h-24 animate-pulse rounded-xl bg-muted/60"></div>
              }
            </div>
          } @else if (!visible().length) {
            <div class="grid place-items-center gap-2 rounded-xl border border-dashed p-16 text-center text-muted-foreground">
              <ui-icon name="search" class="size-8" />
              <p>No icon matches “{{ query() }}”.</p>
            </div>
          } @else {
            <p class="mb-3 text-xs text-muted-foreground" aria-live="polite">{{ filtered().length }} icon{{ filtered().length === 1 ? '' : 's' }}</p>
            <div #grid role="listbox" aria-label="Icons" class="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2" (keydown)="onGridKey($event)">
              @for (n of visible(); track n) {
                <button
                  type="button"
                  role="option"
                  [attr.aria-selected]="selected() === n"
                  class="group/icon relative flex h-24 flex-col items-center justify-center gap-2 rounded-xl border bg-card px-1 text-center transition-all outline-none hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
                  [class]="selected() === n ? 'border-primary ring-2 ring-primary/30' : ''"
                  [attr.data-name]="n"
                  [title]="n"
                  (click)="pick(n)"
                >
                  <span class="icon-glyph grid size-[var(--ls)] place-items-center" [innerHTML]="glyph(n)"></span>
                  <span class="w-full truncate text-[11px] text-muted-foreground group-hover/icon:text-foreground">{{ n }}</span>
                  @if (flash() === n) {
                    <span class="pop absolute inset-x-0 top-1 mx-auto w-fit rounded-full bg-emerald-500 px-1.5 text-[10px] font-medium text-white">copied</span>
                  }
                </button>
              }
            </div>
            @if (visible().length < filtered().length) {
              <div #more class="mt-6 grid place-items-center">
                <button type="button" class="rounded-lg border px-4 py-2 text-sm hover:bg-muted" (click)="limit.set(limit() + PAGE)">
                  Show more ({{ filtered().length - visible().length }} left)
                </button>
              </div>
            }
          }
        </div>

        <!-- details -->
        @if (selectedNode(); as node) {
          <aside
            class="fixed inset-x-0 bottom-0 z-30 max-h-[78svh] overflow-y-auto rounded-t-2xl border bg-background p-4 shadow-2xl lg:sticky lg:top-36 lg:z-auto lg:max-h-[calc(100svh-10rem)] lg:w-[24rem] lg:shrink-0 lg:self-start lg:rounded-2xl lg:shadow-sm"
            aria-label="Icon details"
          >
            <div class="mb-4 flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="truncate text-lg font-semibold">{{ selected() }}</h2>
                <p class="font-mono text-xs text-muted-foreground">{{ pascal() }}</p>
              </div>
              <button type="button" class="grid size-8 shrink-0 place-items-center rounded-lg border hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" aria-label="Close details" (click)="selected.set('')">
                <ui-icon name="x" />
              </button>
            </div>

            <div class="mb-4 grid place-items-center rounded-xl border bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_1px)] [background-size:14px_14px] p-8" [style.color]="color()">
              <ui-icon [icon]="node" [size]="Math.max(size(), 48)" [strokeWidth]="stroke()" [label]="selected() ?? ''" />
            </div>

            @if (tagsOf().length) {
              <ul class="mb-4 flex flex-wrap gap-1.5" aria-label="Tags">
                @for (t of tagsOf(); track t) {
                  <li><button type="button" class="rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground" (click)="setQuery(t)">{{ t }}</button></li>
                }
              </ul>
            }

            <app-code-card label="Icon code" [tabs]="codeTabs()" />

            <div class="mt-3 flex gap-2">
              <button type="button" class="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" (click)="download()">
                <ui-icon name="download" /> Download .svg
              </button>
              <button type="button" class="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" (click)="copy(svgCode(), 'SVG')">
                <ui-icon name="copy" /> Copy SVG
              </button>
            </div>
          </aside>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .icon-glyph svg {
        width: 100%;
        height: 100%;
        stroke-width: var(--lw, 2);
      }
    `,
  ],
})
export class IconsPage {
  protected readonly Math = Math;
  protected readonly PAGE = PAGE;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(UiToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly search = viewChild<ElementRef<HTMLInputElement>>('search');
  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');
  private readonly more = viewChild<ElementRef<HTMLElement>>('more');

  readonly modes = MODES;
  readonly swatches = SWATCHES;
  readonly skeletons = Array.from({ length: 36 }, (_, i) => i);

  private nodes: Record<string, IconNode> = {};
  private tags: Record<string, string[]> = {};
  readonly names = signal<string[]>([]);
  readonly loading = signal(true);
  readonly total = computed(() => this.names().length);

  readonly query = signal('');
  readonly size = signal(24);
  readonly stroke = signal(2);
  readonly color = signal('currentColor');
  readonly mode = signal<CopyMode>((read('loom-icon-mode') as CopyMode) || 'element');
  readonly selected = signal('');
  readonly flash = signal('');
  readonly limit = signal(PAGE);

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const all = this.names();
    if (!q) return all;
    const words = q.split(/\s+/);
    return all.filter((n) => {
      const hay = n + ' ' + (this.tags[n] ?? []).join(' ');
      return words.every((w) => hay.includes(w));
    });
  });
  readonly visible = computed(() => this.filtered().slice(0, this.limit()));
  readonly selectedNode = computed<IconNode | null>(() => (this.selected() ? (this.nodes[this.selected()] ?? null) : null));
  readonly pascal = computed(() => toPascal(this.selected()));
  readonly tagsOf = computed(() => (this.tags[this.selected()] ?? []).slice(0, 12));

  private readonly glyphCache = new Map<string, SafeHtml>();

  constructor() {
    this.load();
    afterNextRender(() => {
      const onKey = (e: KeyboardEvent) => {
        const t = e.target as HTMLElement;
        if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) {
          e.preventDefault();
          this.search()?.nativeElement.focus();
        } else if (e.key === 'Escape' && this.selected() && t.tagName !== 'INPUT') {
          this.selected.set('');
        }
      };
      document.addEventListener('keydown', onKey);
      // infinite scroll: reveal the next batch when the "show more" row nears the viewport
      const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && this.limit.update((l) => l + PAGE), { rootMargin: '600px' });
      const watch = setInterval(() => {
        const el = this.more()?.nativeElement;
        if (el) {
          io.disconnect();
          io.observe(el);
        }
      }, 400);
      this.destroyRef.onDestroy(() => {
        document.removeEventListener('keydown', onKey);
        io.disconnect();
        clearInterval(watch);
      });
    });
  }

  private async load(): Promise<void> {
    // Loaded lazily so the ~800 KB icon set never ships with the rest of the showcase.
    const [n, t] = await Promise.all([import('lucide-static/icon-nodes.json'), import('lucide-static/tags.json')]);
    this.nodes = (n as unknown as { default: Record<string, IconNode> }).default;
    this.tags = (t as unknown as { default: Record<string, string[]> }).default;
    this.names.set(Object.keys(this.nodes).sort());
    this.loading.set(false);
  }

  setQuery(q: string): void {
    this.query.set(q);
    this.limit.set(PAGE);
  }

  setMode(m: CopyMode): void {
    this.mode.set(m);
    try {
      localStorage.setItem('loom-icon-mode', m);
    } catch {}
  }

  glyph(name: string): SafeHtml {
    let g = this.glyphCache.get(name);
    if (!g) {
      const n = this.nodes[name];
      g = this.sanitizer.bypassSecurityTrustHtml(
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n ? iconChildren(n) : ''}</svg>`,
      );
      this.glyphCache.set(name, g);
    }
    return g;
  }

  /* ---- code generation ---- */
  private opts(): string {
    const sz = this.size() !== 16 ? ` [size]="${this.size()}"` : '';
    const sw = this.stroke() !== 2 ? ` [strokeWidth]="${this.stroke()}"` : '';
    return sz + sw;
  }
  private colorAttr(): string {
    return this.color() === 'currentColor' ? '' : ` color="${this.color().startsWith('var') ? 'currentColor' : this.color()}"`;
  }
  readonly svgCode = computed(() => {
    const n = this.selectedNode();
    if (!n) return '';
    const c = this.color();
    return iconToSvg(n, { size: this.size(), strokeWidth: this.stroke(), color: c.startsWith('var') ? 'currentColor' : c });
  });

  codeFor(name: string, mode: CopyMode): string {
    const P = toPascal(name);
    switch (mode) {
      case 'name':
        return name;
      case 'element':
        return `<ui-icon [icon]="${P}"${this.opts()}${this.colorAttr()} />`;
      case 'import':
        return `import { ${P} } from 'lucide';`;
      case 'svg':
        return iconToSvg(this.nodes[name], { size: this.size(), strokeWidth: this.stroke(), color: this.color().startsWith('var') ? 'currentColor' : this.color() });
    }
  }

  readonly codeTabs = computed<CodeTab[]>(() => {
    const name = this.selected();
    if (!name) return [{ label: 'Element', file: 'template.html', code: '' }];
    const P = toPascal(name);
    const opts = this.opts();
    const col = this.colorAttr();
    return [
      {
        label: 'Element',
        file: 'template.html',
        code: `<!-- custom element -->\n<ui-icon [icon]="${P}"${opts}${col} />\n\n<!-- or, on a real <svg> (keeps parent selectors like [&>svg] working) -->\n<svg uiIcon [icon]="${P}" class="size-5"></svg>\n\n<!-- by name, after registerIcons({ ${P} }) -->\n<ui-icon name="${name}" />`,
      },
      {
        label: 'Component',
        file: 'component.ts',
        code: `import { Component } from '@angular/core';\nimport { ${P} } from 'lucide';\nimport { UiIcon } from '@loomui-ng/ui/icon';\n\n@Component({\n  selector: 'app-example',\n  imports: [UiIcon],\n  template: \`<ui-icon [icon]="${P}"${opts}${col} />\`,\n})\nexport class Example {\n  readonly ${P} = ${P};\n}`,
      },
      { label: 'Register', file: 'main.ts', code: `import { ${P} } from 'lucide';\nimport { registerIcons } from '@loomui-ng/ui/icon';\n\nregisterIcons({ ${P} });\n// then anywhere:  <ui-icon name="${name}" />` },
      { label: 'SVG', file: `${name}.svg`, code: this.svgCode() },
      { label: 'Install', file: 'terminal', code: `# icons come from the lucide package\nnpm install lucide\n\n# the <ui-icon> component\nnpx @loomui-ng/cli add icon` },
    ];
  });

  /* ---- interactions ---- */
  async pick(name: string): Promise<void> {
    this.selected.set(name);
    const code = this.codeFor(name, this.mode());
    await this.copy(code, null);
    this.flash.set(name);
    setTimeout(() => this.flash() === name && this.flash.set(''), 1100);
  }

  async copy(text: string, label: string | null): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      if (label) this.toast.success(`${label} copied`);
    } catch {
      this.toast.error('Could not copy to the clipboard');
    }
  }

  download(): void {
    const name = this.selected();
    if (!name) return;
    const url = URL.createObjectURL(new Blob([this.svgCode()], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Arrow-key navigation across the grid (columns are read from the computed grid template). */
  onGridKey(e: KeyboardEvent): void {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const grid = this.grid()?.nativeElement;
    const cells = Array.from(grid?.querySelectorAll<HTMLElement>('button[data-name]') ?? []);
    const i = cells.indexOf(document.activeElement as HTMLElement);
    if (!grid || i < 0) return;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const rtl = document.documentElement.dir === 'rtl';
    let next = i;
    if (e.key === 'ArrowRight') next = i + (rtl ? -1 : 1);
    else if (e.key === 'ArrowLeft') next = i + (rtl ? 1 : -1);
    else if (e.key === 'ArrowDown') next = i + cols;
    else if (e.key === 'ArrowUp') next = i - cols;
    else if (e.key === 'Home') next = 0;
    else next = cells.length - 1;
    next = Math.max(0, Math.min(cells.length - 1, next));
    e.preventDefault();
    cells[next]?.focus();
  }
}
