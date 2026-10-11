import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '@loomui/ui/utils';
import {
  calendarCalendarClass,
  calendarCaptionClass,
  calendarCaptionLabelClass,
  calendarDayButtonClass,
  calendarDayCellClass,
  calendarGridClass,
  calendarMonthClass,
  calendarMonthsClass,
  calendarNavButtonClass,
  calendarNavClass,
  calendarWeekClass,
  calendarWeekdayClass,
  calendarWeekdaysClass,
} from './calendar.classes';
import { UiIconSvg } from '@loomui/ui/icon';
import { UiElementHost } from '@loomui/ui/utils';

export interface DateRange {
  from?: Date;
  to?: Date;
}
export type CalendarSelection = Date | Date[] | DateRange | undefined;

interface DayCell {
  date: Date;
  key: string;
  outside: boolean;
  today: boolean;
  disabled: boolean;
  selected: boolean;
  rangeStart: boolean;
  rangeMiddle: boolean;
  rangeEnd: boolean;
  month: string;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
};
const sameDay = (a?: Date, b?: Date) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * <div uiCalendar mode="single" [(selected)]="date"></div>
 * Observed markup (react-day-picker v9): .rdp-root > months > nav + month > caption + table[role=grid] > thead + tbody > tr > td[role=gridcell][data-day]
 * > button. Keyboard (react-day-picker): arrows ±1 day / ±1 week (mirrored in RTL), PageUp/PageDown ±1 month (Shift: year),
 * Home/End start/end of week, Enter/Space select. Own implementation with native Date + Intl (no date library).
 */
@Component({
  selector: 'div[uiCalendar], ui-calendar', hostDirectives: [UiElementHost],
  imports: [UiIconSvg],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCalendar), multi: true }],
  host: {
    'data-slot': 'calendar',
    '[attr.data-mode]': 'mode()',
    '[attr.data-multiple-months]': 'numberOfMonths() > 1 ? "true" : null',
    '[attr.dir]': 'dir.value',
    '[attr.class]': 'classes()',
  },
  template: `
    <div [class]="monthsClass">
      <nav aria-label="" [class]="navClass">
        <button type="button" [class]="navButtonClass" aria-label="Go to the Previous Month" [disabled]="prevDisabled()" (click)="go(-1)">
          <svg uiIcon="chevron-left" class="size-4 rtl:rotate-180"></svg>
        </button>
        <button type="button" [class]="navButtonClass" aria-label="Go to the Next Month" [disabled]="nextDisabled()" (click)="go(1)">
          <svg uiIcon="chevron-right" class="size-4 rtl:rotate-180"></svg>
        </button>
      </nav>
      @for (m of months(); track m.key) {
        <div [class]="monthClass">
          <div [class]="captionClass"><span role="status" aria-live="polite" [class]="captionLabelClass">{{ m.label }}</span></div>
          <table role="grid" [attr.aria-multiselectable]="mode() !== 'single'" [attr.aria-label]="m.label" [class]="gridClass">
            <thead aria-hidden="true">
              <tr [class]="weekdaysClass">
                @for (w of weekdays(); track w.long) {
                  <th [attr.aria-label]="w.long" [class]="weekdayClass">{{ w.short }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (week of m.weeks; track $index) {
                <tr [class]="weekClass">
                  @for (d of week; track d.key) {
                    <td
                      role="gridcell"
                      [attr.aria-selected]="d.selected || null"
                      [attr.data-day]="d.key"
                      [attr.data-month]="m.key"
                      [attr.data-today]="d.today || null"
                      [attr.data-outside]="d.outside || null"
                      [attr.data-selected]="d.selected || null"
                      [attr.data-disabled]="d.disabled || null"
                      [attr.data-hidden]="d.outside && !showOutsideDays() || null"
                      [class]="cellClass(d)"
                    >
                      @if (!(d.outside && !showOutsideDays())) {
                        <button
                          type="button"
                          data-slot="button"
                          data-variant="ghost"
                          data-size="icon"
                          [attr.data-day]="d.date.toLocaleDateString()"
                          [attr.data-selected-single]="mode() === 'single' && d.selected && !d.rangeStart && !d.rangeEnd && !d.rangeMiddle"
                          [attr.data-range-start]="d.rangeStart"
                          [attr.data-range-middle]="d.rangeMiddle"
                          [attr.data-range-end]="d.rangeEnd"
                          [attr.aria-label]="dayLabel(d.date)"
                          [disabled]="d.disabled"
                          [attr.tabindex]="d.key === tabKey() ? 0 : -1"
                          [class]="dayButtonClass"
                          (click)="pick(d)"
                          (focus)="focused.set(d.key)"
                          (keydown)="onKeydown($event, d)"
                        >{{ d.date.getDate() }}</button>
                      }
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class UiCalendar implements ControlValueAccessor {
  readonly mode = input<'single' | 'multiple' | 'range'>('single');
  readonly selected = model<CalendarSelection>(undefined);
  readonly month = model<Date>(startOfDay(new Date()));
  readonly numberOfMonths = input(1, { transform: numberAttribute });
  readonly showOutsideDays = input(true, { transform: booleanAttribute });
  readonly weekStartsOn = input(0, { transform: numberAttribute });
  readonly locale = input<string>(typeof document !== 'undefined' ? document.documentElement.lang || 'en-US' : 'en-US');
  readonly minDate = input<Date | undefined>(undefined);
  readonly maxDate = input<Date | undefined>(undefined);
  /** Predicate or list of disabled dates. */
  readonly disabled = input<((d: Date) => boolean) | Date[] | undefined>(undefined);
  /** Day cell (td) uses fixed 6 weeks? Off by default (react-day-picker default). */
  readonly required = input(false, { transform: booleanAttribute });
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly dir = inject(Directionality);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly focused = signal<string | null>(null);
  private onChange: (v: CalendarSelection) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly classes = computed(() => cn(calendarCalendarClass, this.userClass()));
  protected readonly monthsClass = calendarMonthsClass;
  protected readonly navClass = calendarNavClass;
  protected readonly navButtonClass = calendarNavButtonClass;
  protected readonly monthClass = calendarMonthClass;
  protected readonly captionClass = calendarCaptionClass;
  protected readonly captionLabelClass = calendarCaptionLabelClass;
  protected readonly gridClass = calendarGridClass;
  protected readonly weekdaysClass = calendarWeekdaysClass;
  protected readonly weekdayClass = calendarWeekdayClass;
  protected readonly weekClass = calendarWeekClass;
  protected readonly dayButtonClass = calendarDayButtonClass;

  private readonly monthFmt = computed(() => new Intl.DateTimeFormat(this.locale(), { month: 'long', year: 'numeric' }));
  private readonly dayFmt = computed(() => new Intl.DateTimeFormat(this.locale(), { dateStyle: 'full' }));

  protected readonly weekdays = computed(() => {
    const start = this.weekStartsOn();
    const short = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    const long = new Intl.DateTimeFormat(this.locale(), { weekday: 'long' });
    const base = new Date(2023, 0, 1); // a Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(base, (start + i) % 7);
      const s = short.format(d);
      return { short: this.locale().startsWith('en') ? s.slice(0, 2) : s, long: long.format(d) };
    });
  });

  private isDisabled(d: Date): boolean {
    const dis = this.disabled();
    if (this.minDate() && startOfDay(d) < startOfDay(this.minDate()!)) return true;
    if (this.maxDate() && startOfDay(d) > startOfDay(this.maxDate()!)) return true;
    if (Array.isArray(dis)) return dis.some((x) => sameDay(x, d));
    return !!dis?.(d);
  }

  private isSelected(d: Date): boolean {
    const s = this.selected();
    if (!s) return false;
    if (s instanceof Date) return sameDay(s, d);
    if (Array.isArray(s)) return s.some((x) => sameDay(x, d));
    const r = s as DateRange;
    if (r.from && r.to) return startOfDay(d) >= startOfDay(r.from) && startOfDay(d) <= startOfDay(r.to);
    return sameDay(r.from, d);
  }

  protected readonly months = computed(() => {
    const out = [];
    const first = this.month();
    const today = startOfDay(new Date());
    const r = this.mode() === 'range' ? ((this.selected() as DateRange) ?? {}) : null;
    for (let i = 0; i < this.numberOfMonths(); i++) {
      const base = new Date(first.getFullYear(), first.getMonth() + i, 1);
      const lead = (base.getDay() - this.weekStartsOn() + 7) % 7;
      const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
      const total = Math.ceil((lead + daysInMonth) / 7) * 7;
      const cells: DayCell[] = [];
      for (let n = 0; n < total; n++) {
        const date = addDays(base, n - lead);
        const outside = date.getMonth() !== base.getMonth();
        const selected = this.isSelected(date);
        const rangeStart = !!r?.from && sameDay(r.from, date);
        const rangeEnd = !!r?.to && sameDay(r.to, date);
        cells.push({
          date,
          key: iso(date),
          outside,
          today: sameDay(date, today),
          disabled: this.isDisabled(date),
          selected,
          rangeStart,
          rangeEnd,
          rangeMiddle: !!r && selected && !rangeStart && !rangeEnd,
          month: iso(base).slice(0, 7),
        });
      }
      const weeks: DayCell[][] = [];
      for (let w = 0; w < cells.length; w += 7) weeks.push(cells.slice(w, w + 7));
      out.push({ key: iso(base).slice(0, 7), label: this.monthFmt().format(base), weeks });
    }
    return out;
  });

  protected readonly tabKey = computed(() => {
    const f = this.focused();
    const all = this.months().flatMap((m) => m.weeks.flat()).filter((d) => !d.outside && !d.disabled);
    if (f && all.some((d) => d.key === f)) return f;
    const sel = all.find((d) => d.selected);
    return (sel ?? all.find((d) => d.today) ?? all[0])?.key ?? null;
  });

  protected readonly prevDisabled = computed(() => {
    const m = this.minDate();
    return !!m && new Date(this.month().getFullYear(), this.month().getMonth(), 0) < startOfDay(m);
  });
  protected readonly nextDisabled = computed(() => {
    const m = this.maxDate();
    return !!m && new Date(this.month().getFullYear(), this.month().getMonth() + this.numberOfMonths(), 1) > startOfDay(m);
  });

  protected dayLabel(d: Date): string {
    return this.dayFmt().format(d);
  }

  protected cellClass(d: DayCell): string {
    const map = calendarDayCellClass;
    if (d.outside && !this.showOutsideDays()) return map['hidden+outside'] ?? map['base'];
    if (d.outside) return map['outside'] ?? map['base'];
    if (d.disabled) return map['disabled'] ?? map['base'];
    if (d.selected && d.today) return map['selected+today'] ?? map['selected'] ?? map['base'];
    if (d.selected && this.mode() === 'range') return map['selected'] ?? map['base'];
    if (d.today) return map['today'] ?? map['base'];
    return map['base'];
  }

  protected go(delta: number): void {
    this.month.set(addMonths(this.month(), delta));
  }

  protected pick(d: DayCell): void {
    if (d.disabled) return;
    const cur = this.selected();
    let next: CalendarSelection;
    switch (this.mode()) {
      case 'single':
        next = sameDay(cur as Date | undefined, d.date) && !this.required() ? undefined : d.date;
        break;
      case 'multiple': {
        const list = Array.isArray(cur) ? cur : [];
        next = list.some((x) => sameDay(x, d.date)) ? list.filter((x) => !sameDay(x, d.date)) : [...list, d.date];
        break;
      }
      case 'range': {
        const r = (cur as DateRange) ?? {};
        if (!r.from || (r.from && r.to)) next = { from: d.date, to: undefined };
        else next = d.date < r.from ? { from: d.date, to: r.from } : { from: r.from, to: d.date };
        break;
      }
    }
    this.selected.set(next);
    this.onChange(next);
    if (d.outside) this.month.set(new Date(d.date.getFullYear(), d.date.getMonth(), 1));
  }

  protected onKeydown(e: KeyboardEvent, d: DayCell): void {
    const rtl = this.dir.value === 'rtl';
    let target: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft':
        target = addDays(d.date, rtl ? 1 : -1);
        break;
      case 'ArrowRight':
        target = addDays(d.date, rtl ? -1 : 1);
        break;
      case 'ArrowUp':
        target = addDays(d.date, -7);
        break;
      case 'ArrowDown':
        target = addDays(d.date, 7);
        break;
      case 'PageUp':
        target = addMonths(d.date, e.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        target = addMonths(d.date, e.shiftKey ? 12 : 1);
        break;
      case 'Home':
        target = addDays(d.date, -((d.date.getDay() - this.weekStartsOn() + 7) % 7));
        break;
      case 'End':
        target = addDays(d.date, 6 - ((d.date.getDay() - this.weekStartsOn() + 7) % 7));
        break;
      default:
        return;
    }
    e.preventDefault();
    this.focusDate(target);
  }

  private focusDate(date: Date): void {
    const first = this.month();
    const last = new Date(first.getFullYear(), first.getMonth() + this.numberOfMonths(), 0);
    if (date < new Date(first.getFullYear(), first.getMonth(), 1) || date > last) {
      this.month.set(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    this.focused.set(iso(date));
    // wait for the grid to re-render, then focus the day button
    setTimeout(() => {
      this.el.querySelector<HTMLElement>(`td[data-day="${iso(date)}"]:not([data-outside="true"]) button`)?.focus();
    }, 0);
  }

  writeValue(v: CalendarSelection): void {
    this.selected.set(v ?? undefined);
    const first = v instanceof Date ? v : Array.isArray(v) ? v[0] : (v as DateRange | undefined)?.from;
    if (first) this.month.set(new Date(first.getFullYear(), first.getMonth(), 1));
  }
  registerOnChange(fn: (v: CalendarSelection) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

export const UI_CALENDAR = [UiCalendar] as const;
