# Table

```ts
import { UI_TABLE_GENERATED } from '@loomui-ng/ui/table';
// add to the component `imports` array
```

```html
<div uiTableContainer>
  <table uiTable>
    <thead uiTableHeader><tr uiTableRow><th uiTableHead>Name</th></tr></thead>
    <tbody uiTableBody><tr uiTableRow><td uiTableCell>Ada</td></tr></tbody>
  </table>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-table-container>
  <ui-table>
    <ui-table-header><ui-table-row><ui-table-head>Name</ui-table-head></ui-table-row></ui-table-header>
    <ui-table-body><ui-table-row><ui-table-cell>Ada</ui-table-cell></ui-table-row></ui-table-body>
  </ui-table>
</ui-table-container>
```


Parts (selectors): `[uiTableContainer], ui-table-container`, `table[uiTable], ui-table`, `caption[uiTableCaption], ui-table-caption`, `thead[uiTableHeader], ui-table-header`, `tbody[uiTableBody], ui-table-body`, `tfoot[uiTableFooter], ui-table-footer`, `tr[uiTableRow], ui-table-row`, `th[uiTableHead], ui-table-head`, `td[uiTableCell], ui-table-cell`.

For sorting/filtering/pagination use the Data Table recipe (`@loomui-ng/ui/data-table` + TanStack Table). Spec: `docs/behavior-specs/table.md` · Manual test: `docs/manual-tests/table.md`
