import { Component, signal } from '@angular/core';
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  FlexRender,
  injectTable,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
  type ColumnDef,
  type ColumnFiltersState,
} from '@tanstack/angular-table';
import { UiButton } from '@loomui-ng/ui/button';
import { UiCheckbox } from '@loomui-ng/ui/checkbox';
import { UI_DATA_TABLE } from '@loomui-ng/ui/data-table';
import { UiInput } from '@loomui-ng/ui/input';
import { UI_TABLE } from '@loomui-ng/ui/table';

type Payment = { id: string; amount: number; status: 'pending' | 'processing' | 'success' | 'failed'; email: string };

const DATA: Payment[] = [
  { id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: '3u1reuv4', amount: 242, status: 'success', email: 'abe45@example.com' },
  { id: 'derv1ws0', amount: 837, status: 'processing', email: 'monserrat44@example.com' },
  { id: '5kma53ae', amount: 874, status: 'success', email: 'silas22@example.com' },
  { id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p0a9sd12', amount: 150, status: 'pending', email: 'jose@example.com' },
  { id: 'q8w7e6r5', amount: 99, status: 'success', email: 'lena@example.com' },
  { id: 'z1x2c3v4', amount: 450, status: 'processing', email: 'omar@example.com' },
  { id: 'a9s8d7f6', amount: 1200, status: 'failed', email: 'priya@example.com' },
  { id: 'l5k4j3h2', amount: 60, status: 'pending', email: 'tomas@example.com' },
  { id: 'u7y6t5r4', amount: 389, status: 'success', email: 'yuki@example.com' },
  { id: 'n3b2v1c0', amount: 512, status: 'success', email: 'diego@example.com' },
];

// Feature set + row models are static: keep them outside the component (TanStack v9 requirement).
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic },
  filterFns: { includesString: filterFn_includesString },
});

const columns: ColumnDef<typeof features, Payment>[] = [
  { id: 'select', enableSorting: false, enableHiding: false, header: 'Select', cell: 'Select' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

@Component({
  selector: 'app-data-table-page',
  imports: [FlexRender, UI_TABLE, UI_DATA_TABLE, UiCheckbox, UiInput],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Data Table</h1>
    <p class="mb-6 text-muted-foreground">
      TanStack Table v9 (<code>&#64;tanstack/angular-table</code>) + table primitives. Spec: docs/behavior-specs/data-table.md
    </p>

    <div class="w-full max-w-3xl">
      <div class="flex items-center gap-2 py-4">
        <input
          uiInput
          class="max-w-sm"
          placeholder="Filter emails..."
          aria-label="Filter emails"
          [value]="emailFilter()"
          (input)="emailFilter.set($any($event.target).value)"
        />
        <ui-data-table-view-options [table]="table" />
      </div>

      <div class="overflow-hidden rounded-md border">
        <div uiTableContainer>
          <table uiTable>
            <thead uiTableHeader>
              @for (hg of table.getHeaderGroups(); track hg.id) {
                <tr uiTableRow>
                  @for (header of hg.headers; track header.id) {
                    <th uiTableHead>
                      @if (!header.isPlaceholder) {
                        @switch (header.column.id) {
                          @case ('select') {
                            <button
                              uiCheckbox
                              aria-label="Select all"
                              [checked]="table.getIsAllPageRowsSelected()"
                              [indeterminate]="table.getIsSomePageRowsSelected()"
                              (checkedChange)="table.toggleAllPageRowsSelected($event)"
                            ></button>
                          }
                          @case ('amount') {
                            <div class="text-end">
                              <ui-data-table-column-header [column]="header.column" title="Amount" />
                            </div>
                          }
                          @default {
                            <ui-data-table-column-header [column]="header.column" [title]="titleOf(header.column.id)" />
                          }
                        }
                      }
                    </th>
                  }
                </tr>
              }
            </thead>
            <tbody uiTableBody>
              @for (row of table.getRowModel().rows; track row.id) {
                <tr uiTableRow [attr.data-state]="row.getIsSelected() ? 'selected' : null">
                  @for (cell of row.getVisibleCells(); track cell.id) {
                    <td uiTableCell>
                      @switch (cell.column.id) {
                        @case ('select') {
                          <button
                            uiCheckbox
                            aria-label="Select row"
                            [checked]="row.getIsSelected()"
                            (checkedChange)="row.toggleSelected($event)"
                          ></button>
                        }
                        @case ('status') {
                          <span class="capitalize">{{ cell.getValue() }}</span>
                        }
                        @case ('email') {
                          <span class="lowercase">{{ cell.getValue() }}</span>
                        }
                        @case ('amount') {
                          <div class="text-end font-medium">{{ money(cell.getValue()) }}</div>
                        }
                      }
                    </td>
                  }
                </tr>
              } @empty {
                <tr uiTableRow>
                  <td uiTableCell [attr.colspan]="columns.length" class="h-24 text-center">No results.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <ui-data-table-pagination class="py-4" [table]="table" [pageSizes]="[5, 10, 20]" />
    </div>
  `,
})
export class DataTablePage {
  readonly columns = columns;
  readonly emailFilter = signal('');

  readonly table = injectTable(() => ({
    features,
    columns,
    data: DATA,
    getRowId: (row: Payment) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    // Reactive input: re-evaluated when the filter signal changes.
    state: { columnFilters: [{ id: 'email', value: this.emailFilter() }] as ColumnFiltersState },
  }));

  titleOf(id: string): string {
    return id[0].toUpperCase() + id.slice(1);
  }

  money(v: unknown): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v));
  }
}
