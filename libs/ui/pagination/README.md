# Pagination

```ts
import { UI_PAGINATION } from '@loomui-ng/ui/pagination';
// add to the component `imports` array
```

```html
<nav uiPagination>
  <ul uiPaginationContent>
    <li uiPaginationItem><a uiPaginationPrevious href="#"></a></li>
    <li uiPaginationItem><a uiPaginationLink href="#" [isActive]="true">1</a></li>
    <li uiPaginationItem><a uiPaginationNext href="#"></a></li>
  </ul>
</nav>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-pagination>
  <ui-pagination-content>
    <ui-pagination-item><ui-pagination-previous href="#"></ui-pagination-previous></ui-pagination-item>
    <ui-pagination-item><ui-pagination-link href="#" [isActive]="true">1</ui-pagination-link></ui-pagination-item>
    <ui-pagination-item><ui-pagination-next href="#"></ui-pagination-next></ui-pagination-item>
  </ui-pagination-content>
</ui-pagination>
```

| Input / output | Type / values | Default |
|---|---|---|
| `isActive` |  | `false` |
| `size` | `LinkSize` | `'icon'` |

Parts (selectors): `a[uiPaginationLink], ui-pagination-link`, `a[uiPaginationPrevious], ui-pagination-previous`, `a[uiPaginationNext], ui-pagination-next`, `span[uiPaginationEllipsis], ui-pagination-ellipsis`, `nav[uiPagination], ui-pagination`, `ul[uiPaginationContent], ui-pagination-content`, `li[uiPaginationItem], ui-pagination-item`.

Spec: `docs/behavior-specs/pagination.md` · Manual test: `docs/manual-tests/pagination.md`
