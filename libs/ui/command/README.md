# uiCommand

```ts
import { UI_COMMAND } from '@loomui-ng/ui/command';
// add to the component imports array
```

```html
<div uiCommand class="max-w-sm rounded-lg border">
  <div uiCommandInputWrapper><input uiCommandInput placeholder="Search..." /></div>
  <div uiCommandList>
    <div uiCommandEmpty>No results found.</div>
    <div uiCommandGroup heading="Suggestions">
      <div uiCommandItem value="Calendar" (select)="open()">Calendar</div>
    </div>
  </div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-command class="max-w-sm rounded-lg border">
  <ui-command-input-wrapper><ui-command-input placeholder="Search..." /></ui-command-input-wrapper>
  <ui-command-list>
    <ui-command-empty>No results found.</ui-command-empty>
    <ui-command-group heading="Suggestions">
      <ui-command-item value="Calendar" (select)="open()">Calendar</ui-command-item>
    </ui-command-group>
  </ui-command-list>
</ui-command>
```

| Input | Values | Default |
|---|---|---|
| `value` (item) | string | text content |
| `keywords` (item) | string[] | `[]` |
| `disabled` (item) | boolean | `false` |
| `heading` (group) | string | `''` |
| `(select)` | void event | - |

Filtering is substring-based (no cmdk scoring/re-ordering). Needs the .no-scrollbar utility from the playground styles.css.

Spec: docs/behavior-specs/command.md - Manual checks: docs/manual-tests/command.md
