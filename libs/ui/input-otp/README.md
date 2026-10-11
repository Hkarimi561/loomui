# Input OTP

```ts
import { UI_INPUT_OTP } from '@loomui/ui/input-otp';
// add to the component `imports` array
```

```html
<div uiInputOtp [maxLength]="6" [(value)]="code" (complete)="verify($event)">
  <div uiInputOtpGroup><div uiInputOtpSlot [index]="0"></div>…</div>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-input-otp [maxLength]="6" [(value)]="code" (complete)="verify($event)">
  <ui-input-otp-group><ui-input-otp-slot [index]="0"></ui-input-otp-slot>…</ui-input-otp-group>
</ui-input-otp>
```

| Input / output | Type / values | Default |
|---|---|---|
| `value` (model) |  | `''` |
| `maxLength` |  | `6` |
| `pattern` | `string` | `'^\\d+$'` |
| `disabled` |  | `false` |
| `invalid` |  | `false` |
| `required` |  | `false` |
| `complete` (output) | `string` |  |
| `index` | `number` | required |

Parts (selectors): `div[uiInputOtp], ui-input-otp`, `[uiInputOtpGroup], ui-input-otp-group`, `[uiInputOtpSlot], ui-input-otp-slot`, `[uiInputOtpSeparator], ui-input-otp-separator`.

Spec: `docs/behavior-specs/input-otp.md` · Manual test: `docs/manual-tests/input-otp.md`
