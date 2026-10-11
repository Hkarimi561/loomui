# Breadcrumb

```ts
import { UI_BREADCRUMB } from '@loomui-ng/ui/breadcrumb';
// add to the component `imports` array
```

```html
<nav uiBreadcrumb>
  <ol uiBreadcrumbList>
    <li uiBreadcrumbItem><a uiBreadcrumbLink href="/">Home</a></li>
    <li uiBreadcrumbSeparator></li>
    <li uiBreadcrumbItem><span uiBreadcrumbPage>Components</span></li>
  </ol>
</nav>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-breadcrumb>
  <ui-breadcrumb-list>
    <ui-breadcrumb-item><ui-breadcrumb-link href="/">Home</ui-breadcrumb-link></ui-breadcrumb-item>
    <ui-breadcrumb-separator></ui-breadcrumb-separator>
    <ui-breadcrumb-item><ui-breadcrumb-page>Components</ui-breadcrumb-page></ui-breadcrumb-item>
  </ui-breadcrumb-list>
</ui-breadcrumb>
```


Parts (selectors): `li[uiBreadcrumbSeparator], ui-breadcrumb-separator`, `span[uiBreadcrumbEllipsis], ui-breadcrumb-ellipsis`, `nav[uiBreadcrumb], ui-breadcrumb`, `ol[uiBreadcrumbList], ui-breadcrumb-list`, `li[uiBreadcrumbItem], ui-breadcrumb-item`, `a[uiBreadcrumbLink], ui-breadcrumb-link`, `span[uiBreadcrumbPage], ui-breadcrumb-page`.

Spec: `docs/behavior-specs/breadcrumb.md` · Manual test: `docs/manual-tests/breadcrumb.md`
