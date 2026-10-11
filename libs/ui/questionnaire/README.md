# Questionnaire

```ts
import { UI_QUESTIONNAIRE } from '@loomui-ng/ui/questionnaire';
// add to the component `imports` array
```

```html
<form uiQuestionnaire #q="uiQuestionnaire" (submitted)="save($event)">
  <div uiQuestionnaireProgress></div>
  <fieldset uiQuestionnaireItem name="plan" required>
    <legend uiQuestionnaireTitle>Pick a plan</legend>
    <div uiQuestionnaireChoices><label uiQuestionnaireChoice value="free">Free</label></div>
  </fieldset>
  <div uiQuestionnaireActions>
    <button type="button" (click)="q.previous()">Back</button>
    <button type="button" (click)="q.next()">Next</button>
  </div>
</form>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-questionnaire #q="uiQuestionnaire" (submitted)="save($event)">
  <ui-questionnaire-progress></ui-questionnaire-progress>
  <ui-questionnaire-item name="plan" required>
    <ui-questionnaire-title>Pick a plan</ui-questionnaire-title>
    <ui-questionnaire-choices><ui-questionnaire-choice value="free">Free</ui-questionnaire-choice></ui-questionnaire-choices>
  </ui-questionnaire-item>
  <ui-questionnaire-actions>
    <button type="button" (click)="q.previous()">Back</button>
    <button type="button" (click)="q.next()">Next</button>
  </ui-questionnaire-actions>
</ui-questionnaire>
```

| Input / output | Type / values | Default |
|---|---|---|
| `current` (model) |  | `0` |
| `shortcuts` |  | `true` |
| `submitted` (output) | `Record<string, string \| string[]>` |  |
| `name` | `string` | `''` |
| `required` |  | `false` |
| `multiple` |  | `false` |
| `value` | `string` | required |
| `shortcut` | `string` | `''` |
| `placeholder` |  | `''` |

Parts (selectors): `form[uiQuestionnaire], ui-questionnaire`, `div[uiQuestionnaireProgress], ui-questionnaire-progress`, `fieldset[uiQuestionnaireItem], ui-questionnaire-item`, `legend[uiQuestionnaireTitle], ui-questionnaire-title`, `p[uiQuestionnaireDescription], ui-questionnaire-description`, `div[uiQuestionnaireChoices], ui-questionnaire-choices`, `label[uiQuestionnaireChoice], ui-questionnaire-choice`, `div[uiQuestionnaireInput], ui-questionnaire-input`, `div[uiQuestionnaireActions], ui-questionnaire-actions`.

Spec: `docs/behavior-specs/questionnaire.md` · Manual test: `docs/manual-tests/questionnaire.md`
