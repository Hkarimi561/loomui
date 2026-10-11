import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Chart, registerables, type ChartOptions, type ChartType } from 'chart.js';
import { cn } from '@loomui/ui/utils';

Chart.register(...registerables);

export interface ChartSeriesConfig {
  label: string;
  /** CSS color, e.g. 'var(--chart-1)'. Exposed as --color-<key> on the container (as shadcn's ChartContainer does). */
  color: string;
}
export type ChartConfig = Record<string, ChartSeriesConfig>;

/**
 * shadcn's Chart wraps Recharts. This implementation uses Chart.js and keeps shadcn's contract:
 * a `config` maps series keys to label + color; the container exposes `--color-<key>` CSS variables; tooltip and legend
 * follow shadcn styling (card-like tooltip, small legend swatches). Data rows are plain objects.
 *
 * <ui-chart type="bar" [data]="rows" xKey="month" [config]="config" class="h-64 w-full" />
 * For pie/doughnut, rows are categories: xKey = category field, valueKey = number field, config keyed by category value.
 * Deviation: Recharts-specific components (ChartTooltipContent props, <Bar radius>) have no 1:1 equivalent.
 */
@Component({
  selector: 'ui-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'chart',
    '[attr.data-chart]': 'chartId',
    '[attr.class]': 'classes()',
    '[style]': 'cssVars()',
  },
  template: `
    <div class="relative size-full min-h-48 min-w-0 flex-1 overflow-hidden"><canvas #canvas role="img" [attr.aria-label]="label()"></canvas></div>
    @if (showLegend()) {
      <ul data-slot="chart-legend" class="flex items-center justify-center gap-4 pt-3 text-xs">
        @for (item of legend(); track item.key) {
          <li class="flex items-center gap-1.5">
            <span class="size-2 shrink-0 rounded-[2px]" [style.background]="item.color"></span>{{ item.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class UiChart {
  private static n = 0;
  protected readonly chartId = `chart-${++UiChart.n}`;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly type = input<ChartType>('bar');
  readonly data = input.required<Record<string, unknown>[]>();
  readonly xKey = input.required<string>();
  readonly valueKey = input<string>('');
  readonly config = input.required<ChartConfig>();
  readonly options = input<Record<string, any>>({});
  readonly showLegend = input(true);
  readonly label = input('Chart');
  readonly userClass = input<string>('', { alias: 'class' });

  private readonly destroyRef = inject(DestroyRef);
  private chart: Chart | null = null;
  private ready = false;

  protected readonly classes = computed(() =>
    cn('flex aspect-video min-w-0 flex-col justify-center text-xs [&_canvas]:max-w-full', this.userClass()),
  );
  protected readonly cssVars = computed(() => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(this.config())) out[`--color-${k}`] = v.color;
    return out;
  });
  private readonly circular = computed(() => this.type() === 'pie' || this.type() === 'doughnut' || this.type() === 'polarArea');
  protected readonly legend = computed(() => {
    const cfg = this.config();
    const keys = this.circular() ? this.data().map((r) => String(r[this.xKey()])) : Object.keys(cfg);
    return keys.filter((k) => cfg[k]).map((k) => ({ key: k, label: cfg[k].label, color: cfg[k].color }));
  });

  constructor() {
    afterNextRender(() => {
      this.ready = true;
      this.render();
      const mo = new MutationObserver(() => this.render());
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      this.destroyRef.onDestroy(() => {
        mo.disconnect();
        this.chart?.destroy();
      });
    });
    effect(() => {
      this.type();
      this.data();
      this.config();
      this.options();
      this.xKey();
      this.valueKey();
      if (this.ready) this.render();
    });
  }

  /** Resolves `var(--x)` to the computed color so Chart.js (canvas) can paint it, honoring .dark. */
  private resolve(color: string): string {
    const probe = this.host;
    const m = /^var\((--[\w-]+)\)$/.exec(color.trim());
    if (!m) return color;
    return getComputedStyle(probe).getPropertyValue(m[1]).trim() || color;
  }

  private render(): void {
    const cfg = this.config();
    const rows = this.data();
    const x = this.xKey();
    const fg = getComputedStyle(this.host).getPropertyValue('--muted-foreground').trim() || '#888';
    const grid = getComputedStyle(this.host).getPropertyValue('--border').trim() || '#8884';
    const type = this.type();
    const labels = rows.map((r) => String(r[x]));
    const datasets = this.circular()
      ? [
          {
            label: this.label(),
            data: rows.map((r) => Number(r[this.valueKey()])),
            backgroundColor: labels.map((l) => this.resolve(cfg[l]?.color ?? '#888')),
            borderWidth: 0,
          },
        ]
      : Object.entries(cfg).map(([key, c]) => ({
          label: c.label,
          data: rows.map((r) => Number(r[key])),
          backgroundColor: this.resolve(c.color),
          borderColor: this.resolve(c.color),
          borderRadius: type === 'bar' ? 4 : 0,
          borderWidth: type === 'bar' ? 0 : 2,
          tension: 0.3,
          pointRadius: type === 'line' ? 0 : 3,
          fill: false,
        }));
    const tooltipBg = getComputedStyle(this.host).getPropertyValue('--background').trim() || '#fff';
    const tooltipFg = getComputedStyle(this.host).getPropertyValue('--foreground').trim() || '#000';
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipFg,
          bodyColor: tooltipFg,
          borderColor: grid,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          boxPadding: 4,
          usePointStyle: false,
        },
      },
      scales: this.circular() || type === 'radar'
        ? {}
        : {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: fg } },
            y: { grid: { color: grid }, border: { display: false }, ticks: { color: fg } },
          },
      ...this.options(),
    };
    const config = { type, data: { labels, datasets }, options } as never;
    if (this.chart && (this.chart.config as { type?: string }).type === type) {
      this.chart.data = { labels, datasets } as never;
      this.chart.options = options as never;
      this.chart.update();
    } else {
      this.chart?.destroy();
      this.chart = new Chart(this.canvas().nativeElement, config);
    }
  }
}

export const UI_CHART = [UiChart] as const;
