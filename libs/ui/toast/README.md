# uiToast

```ts
import { UiToaster, UiToastService } from '@loomui/ui/toast';
// add to the component imports array
```

```html
// app root template
<ui-toaster position="bottom-right" />

// anywhere
private toast = inject(UiToastService);
this.toast.show('Event has been created', { description: 'Sunday', action: { label: 'Undo', onClick: () => {} } });
this.toast.success('Saved');
```

| Input | Values | Default |
|---|---|---|
| `position` (ui-toaster) | `top-left` `top-center` `top-right` `bottom-left` `bottom-center` `bottom-right` | `bottom-right` |
| `visibleToasts` | number | `3` |
| `duration` | ms | `4000` |
| `theme` | `light` `dark` `system` | `system` |

Import libs/ui/toast/toast.css once (see libs/ui/README.md). Not implemented: swipe, close button, promise toasts.

Spec: docs/behavior-specs/toast.md - Manual checks: docs/manual-tests/toast.md
