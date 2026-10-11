# Data Table

```ts
import { UI_DATA_TABLE } from '@loomui/ui/data-table';
// add to the component `imports` array
```

```html
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature, columnFilteringFeature, columnVisibilityFeature, rowSelectionFeature,
  sortedRowModel: createSortedRowModel(), filteredRowModel: createFilteredRowModel(), paginatedRowModel: createPaginatedRowModel() });
table = injectTable(() => ({ features, columns, data: DATA, getRowId: (r) => r.id }));

<ui-data-table-view-options [table]="table" />
<table uiTable> … @for (row of table.getRowModel().rows; track row.id) … </table>
<ui-data-table-pagination [table]="table" />
```

Same thing as custom elements (identical inputs; directives keep working):

```html
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature, columnFilteringFeature, columnVisibilityFeature, rowSelectionFeature,
  sortedRowModel: createSortedRowModel(), filteredRowModel: createFilteredRowModel(), paginatedRowModel: createPaginatedRowModel() });
table = injectTable(() => ({ features, columns, data: DATA, getRowId: (r) => r.id }));

<ui-data-table-view-options [table]="table" />
<ui-table> … @for (row of table.getRowModel().rows; track row.id) … </ui-table>
<ui-data-table-pagination [table]="table" />
```

| Input / output | Type / values | Default |
|---|---|---|
| `column` | `DataTableColumnLike` | required |
| `title` | `string` | required |
| `table` | `DataTableLike` | required |
| `pageSizes` | `number[]` | `[10, 20, 30, 50]` |

Parts (selectors): `ui-data-table-column-header`, `ui-data-table-view-options`, `ui-data-table-pagination`.

Install `@tanstack/angular-table`. See `projects/playground/src/app/pages/data-table-page.ts` for the full demo. Spec: `docs/behavior-specs/data-table.md` · Manual test: `docs/manual-tests/data-table.md`
