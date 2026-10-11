# uiDialog

```ts
import { UI_DIALOG } from '@loomui/ui/dialog';
// add to the component imports array
```

```html
<div uiDialog [(open)]="open" class="contents">
  <button uiButton variant="outline" uiDialogTrigger>Open Dialog</button>
  <div uiDialogContent>
    <div uiDialogHeader>
      <h2 uiDialogTitle>Edit profile</h2>
      <p uiDialogDescription>Make changes here.</p>
    </div>
    <input uiInput value="Pedro" />
    <div uiDialogFooter>
      <button uiButton variant="outline" uiDialogClose>Cancel</button>
      <button uiButton uiDialogClose>Save</button>
    </div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-dialog [(open)]="open" class="contents">
  <ui-button variant="outline" uiDialogTrigger>Open Dialog</ui-button>
  <ui-dialog-content>
    <ui-dialog-header>
      <ui-dialog-title>Edit profile</ui-dialog-title>
      <ui-dialog-description>Make changes here.</ui-dialog-description>
    </ui-dialog-header>
    <ui-input value="Pedro" />
    <ui-dialog-footer>
      <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
      <ui-button uiDialogClose>Save</ui-button>
    </ui-dialog-footer>
  </ui-dialog-content>
</ui-dialog>
```

| Input | Values | Default |
|---|---|---|
| `open` (uiDialog) | model boolean | `false` |
| `showCloseButton` (uiDialogContent) | boolean | `true` |
| `class` | extra classes | - |

Content moves to the CDK overlay while open and stays in the component DOM (hidden) otherwise. Focus is trapped, first tabbable element focused, focus returns to the trigger. Needs `@angular/cdk/overlay-prebuilt.css` and the data-open/data-closed custom variants (see libs/ui/README.md).

Spec: docs/behavior-specs/dialog.md - Manual checks: docs/manual-tests/dialog.md
