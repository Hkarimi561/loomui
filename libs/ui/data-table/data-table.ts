import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { buttonVariants } from '@loomui-ng/ui/button';
import { UI_DROPDOWN_MENU } from '@loomui-ng/ui/dropdown-menu';
import { cn } from '@loomui-ng/ui/utils';
import { UiIconSvg } from '@loomui-ng/ui/icon';

/**
 * shadcn's "Data Table" is a recipe, not a package component: TanStack Table (headless) + the Table primitives + a few
 * helpers (sortable column header, view options, pagination). This file ships those helpers for @tanstack/angular-table v9;
 * the table instance comes from `injectTable(...)` in your component, rendering uses `FlexRender` + `@loomui-ng/ui/table`.
 * The helpers accept the (signal-reactive) table/column and only call TanStack APIs, so they work with any feature set
 * that registers rowSortingFeature / columnVisibilityFeature / rowPaginationFeature / rowSelectionFeature.
 */

/** Structural subsets of TanStack's Column/Table so the helpers accept any feature set without generic friction. */
export interface DataTableColumnLike {
  readonly id: string;
  accessorFn?: unknown;
  getCanSort(): boolean;
  getCanHide(): boolean;
  getIsSorted(): false | 'asc' | 'desc';
  getIsVisible(): boolean;
  toggleSorting(desc?: boolean, multi?: boolean): void;
  toggleVisibility(value?: boolean): void;
}
export interface DataTableLike {
  getAllColumns(): DataTableColumnLike[];
  getFilteredSelectedRowModel(): { rows: unknown[] };
  getFilteredRowModel(): { rows: unknown[] };
  atoms: { pagination: { get(): { pageIndex: number; pageSize: number } } };
  setPageSize(size: number): void;
  getPageCount(): number;
  getCanPreviousPage(): boolean;
  getCanNextPage(): boolean;
  previousPage(): void;
  nextPage(): void;
}


/** Sortable column header: ghost button opening Asc / Desc / Hide (as in the shadcn data-table demo). */
@Component({
  selector: 'ui-data-table-column-header',
  imports: [UiIconSvg, UI_DROPDOWN_MENU],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'data-table-column-header', '[attr.class]': 'classes()' },
  template: `
    @if (column().getCanSort()) {
      <div uiDropdownMenu class="contents">
        <button
          type="button"
          uiDropdownMenuTrigger
          [class]="triggerClass"
          [attr.data-sorted]="sorted() || null"
        >
          <span>{{ title() }}</span>
          <svg [uiIcon]="sortIcon()" class="size-3.5"></svg>
        </button>
        <div uiDropdownMenuContent align="start" class="w-32">
          <div uiDropdownMenuItem (select)="column().toggleSorting(false)">Asc</div>
          <div uiDropdownMenuItem (select)="column().toggleSorting(true)">Desc</div>
          @if (column().getCanHide()) {
            <div uiDropdownMenuSeparator></div>
            <div uiDropdownMenuItem (select)="column().toggleVisibility(false)">Hide</div>
          }
        </div>
      </div>
    } @else {
      <span>{{ title() }}</span>
    }
  `,
})
export class UiDataTableColumnHeader {
  readonly column = input.required<DataTableColumnLike>();
  readonly title = input.required<string>();
  readonly userClass = input<string>('', { alias: 'class' });

  protected readonly sortIcon = computed(() => (this.sorted() === 'asc' ? 'arrow-up' : this.sorted() === 'desc' ? 'arrow-down' : 'chevrons-up-down'));
  protected readonly triggerClass = cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ms-2 data-[sorted]:text-foreground');
  protected readonly sorted = computed(() => this.column().getIsSorted() || '');
  protected readonly classes = computed(() => cn('flex items-center', this.userClass()));
}

/** "Columns" dropdown listing every hideable column as a checkbox item. */
@Component({
  selector: 'ui-data-table-view-options',
  imports: [UiIconSvg, UI_DROPDOWN_MENU],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'data-table-view-options', class: 'contents' },
  template: `
    <div uiDropdownMenu class="contents">
      <button type="button" uiDropdownMenuTrigger [class]="triggerClass">
        <svg uiIcon="sliders-horizontal" class="size-4"></svg>
        View
      </button>
      <div uiDropdownMenuContent align="end" class="w-40">
        <div uiDropdownMenuLabel>Toggle columns</div>
        <div uiDropdownMenuSeparator></div>
        @for (col of columns(); track col.id) {
          <div
            uiDropdownMenuCheckboxItem
            class="capitalize"
            [checked]="col.getIsVisible()"
            (checkedChange)="col.toggleVisibility($event)"
            (select)="$event.preventDefault()"
          >
            {{ col.id }}
          </div>
        }
      </div>
    </div>
  `,
})
export class UiDataTableViewOptions {
  readonly table = input.required<DataTableLike>();
  protected readonly triggerClass = cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'ms-auto hidden h-8 lg:flex');
  protected readonly columns = computed(() => this.table().getAllColumns().filter((c) => c.accessorFn !== undefined && c.getCanHide()));
}

/** Footer: "N of M row(s) selected." + rows-per-page + Previous/Next (and page counter). */
@Component({
  selector: 'ui-data-table-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'data-table-pagination', '[attr.class]': 'classes()' },
  template: `
    <div class="flex-1 text-sm text-muted-foreground">
      {{ table().getFilteredSelectedRowModel().rows.length }} of {{ table().getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3 lg:gap-x-8">
      <label class="flex items-center gap-2 text-sm font-medium">
        <span class="hidden sm:inline">Rows per page</span>
        <select
          class="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          [value]="table().atoms.pagination.get().pageSize"
          (change)="table().setPageSize(+$any($event.target).value)"
        >
          @for (s of pageSizes(); track s) {
            <option [value]="s" [selected]="s === table().atoms.pagination.get().pageSize">{{ s }}</option>
          }
        </select>
      </label>
      <div class="flex min-w-24 items-center justify-center text-sm font-medium" aria-live="polite">
        Page {{ table().atoms.pagination.get().pageIndex + 1 }} of {{ table().getPageCount() }}
      </div>
      <div class="flex items-center gap-2">
        <button type="button" [class]="btn" [disabled]="!table().getCanPreviousPage()" (click)="table().previousPage()">Previous</button>
        <button type="button" [class]="btn" [disabled]="!table().getCanNextPage()" (click)="table().nextPage()">Next</button>
      </div>
    </div>
  `,
})
export class UiDataTablePagination {
  readonly table = input.required<DataTableLike>();
  readonly pageSizes = input<number[]>([10, 20, 30, 50]);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly btn = buttonVariants({ variant: 'outline', size: 'sm' });
  protected readonly classes = computed(() => cn('flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-2', this.userClass()));
}

export const UI_DATA_TABLE = [UiDataTableColumnHeader, UiDataTableViewOptions, UiDataTablePagination] as const;
