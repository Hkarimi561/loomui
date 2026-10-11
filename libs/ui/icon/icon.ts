import { booleanAttribute, ChangeDetectionStrategy, Component, computed, Directive, inject, input, numberAttribute, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleCheck,
  Ellipsis,
  GripVertical,
  Info,
  LoaderCircle,
  Minus,
  OctagonX,
  PanelLeft,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from 'lucide';
import { cn } from '@loomui/ui/utils';

/** Lucide's icon node format: a list of [tag, attributes] pairs describing the SVG children. */
export type IconNode = [tag: string, attrs: Record<string, string | number | undefined>][];

/** `ChevronDown` / `chevron-down` → `chevron-down` (Lucide's canonical name). */
export function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .toLowerCase();
}

/** `chevron-down` → `ChevronDown` (the export name in the `lucide` package). */
export function toPascal(name: string): string {
  return name
    .split('-')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join('');
}

const registry = signal<Record<string, IconNode>>({});

/**
 * Registers icons so they can be used by name: `registerIcons({ Search, Moon })` then `<ui-icon name="search" />`.
 * Keys may be PascalCase export names or kebab-case names. Importing only the icons you use keeps bundles small.
 */
export function registerIcons(icons: Record<string, IconNode>): void {
  const next = { ...registry() };
  for (const [k, v] of Object.entries(icons)) next[toKebab(k)] = v;
  registry.set(next);
}

/** Icons the Loom UI components render themselves (chevrons, check, x, …). Registered on first import. */
export const LIB_ICONS: Record<string, IconNode> = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleCheck,
  Ellipsis,
  GripVertical,
  Info,
  LoaderCircle,
  Minus,
  OctagonX,
  PanelLeft,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  X,
};
registerIcons(LIB_ICONS);

const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Serialises an icon node to the SVG children markup (all values escaped). */
export function iconChildren(node: IconNode): string {
  return node
    .map(([tag, attrs]) => `<${tag}${Object.entries(attrs).filter(([k, v]) => k !== 'key' && v !== undefined).map(([k, v]) => ` ${k}="${esc(String(v))}"`).join('')}/>`)
    .join('');
}

/** A complete standalone `<svg>` string (what Lucide's own `lucide-static` files look like). */
export function iconToSvg(node: IconNode, opts: { size?: number; strokeWidth?: number; color?: string } = {}): string {
  const { size = 24, strokeWidth = 2, color = 'currentColor' } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${iconChildren(node)}</svg>`;
}

/**
 * Lucide icon.
 *   <ui-icon name="search" />                 — by name (see registerIcons)
 *   <ui-icon [icon]="Search" size="20" />     — by node (`import { Search } from 'lucide'`, tree-shakeable)
 * Defaults to 16px (`size-4`, the shadcn convention); set `size`, or a size class such as class="size-6".
 * Decorative by default (aria-hidden); pass `label` to expose it as an image.
 */
@Component({
  selector: 'ui-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'icon',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[attr.class]': 'classes()',
  },
  template: `<svg
    class="size-full"
    viewBox="0 0 24 24"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    [attr.stroke]="color()"
    [attr.stroke-width]="sw()"
    [innerHTML]="html()"
  ></svg>`,
})
export class UiIcon {
  private readonly sanitizer = inject(DomSanitizer);
  /** An icon node (preferred; tree-shakeable). */
  readonly icon = input<IconNode | null | undefined>(null);
  /** A registered icon name (kebab or Pascal case). */
  readonly name = input<string>('');
  /** Pixel size; when omitted the icon is `size-4` (override with a class). */
  readonly size = input<number | undefined, unknown>(undefined, { transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)) });
  readonly strokeWidth = input(2, { transform: numberAttribute });
  /** Keeps the stroke the same pixel width regardless of size (Lucide's absoluteStrokeWidth). */
  readonly absoluteStrokeWidth = input(false, { transform: booleanAttribute });
  readonly color = input('currentColor');
  readonly label = input('');
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly node = computed<IconNode | null>(() => this.icon() ?? registry()[toKebab(this.name())] ?? null);
  protected readonly sw = computed(() => (this.absoluteStrokeWidth() ? (this.strokeWidth() * 24) / (this.size() ?? 16) : this.strokeWidth()));
  protected readonly html = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.node() ? iconChildren(this.node()!) : ''));
  protected readonly classes = computed(() => cn('inline-flex shrink-0 items-center justify-center', this.size() === undefined && 'size-4', this.userClass()));
}

/**
 * Same icons rendered onto a real <svg> element, so parent selectors such as `[&>svg]:size-4` and `has-[>svg]` keep working:
 *   <svg uiIcon="chevron-down" class="size-4"></svg>      <svg uiIcon [icon]="Search"></svg>
 * This is what the Loom UI components use internally.
 */
@Directive({
  selector: 'svg[uiIcon]',
  host: {
    'data-slot': 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    '[attr.stroke]': 'color()',
    '[attr.stroke-width]': 'sw()',
    '[attr.width]': 'size()',
    '[attr.height]': 'size()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[innerHTML]': 'html()',
    '[attr.class]': 'classes()',
  },
})
export class UiIconSvg {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input<string>('', { alias: 'uiIcon' });
  readonly icon = input<IconNode | null | undefined>(null);
  readonly size = input<number | undefined, unknown>(undefined, { transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)) });
  readonly strokeWidth = input(2, { transform: numberAttribute });
  readonly absoluteStrokeWidth = input(false, { transform: booleanAttribute });
  readonly color = input('currentColor');
  readonly label = input('');
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly node = computed<IconNode | null>(() => this.icon() ?? registry()[toKebab(this.name())] ?? null);
  protected readonly sw = computed(() => (this.absoluteStrokeWidth() ? (this.strokeWidth() * 24) / (this.size() ?? 16) : this.strokeWidth()));
  protected readonly html = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.node() ? iconChildren(this.node()!) : ''));
  protected readonly classes = computed(() => cn(this.size() === undefined && 'size-4', this.userClass()) || null);
}

export const UI_ICON = [UiIcon, UiIconSvg] as const;
