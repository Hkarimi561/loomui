# Carousel

```ts
import { UI_CAROUSEL } from '@loomui-ng/ui/carousel';
// add to the component `imports` array
```

```html
<div uiCarousel class="mx-auto w-full max-w-xs">
  <div uiCarouselContent>
    <div uiCarouselItem>1</div>
    <div uiCarouselItem>2</div>
  </div>
  <button uiCarouselPrevious></button>
  <button uiCarouselNext></button>
</div>
```

Same thing as custom elements (identical inputs; directives keep working):

```html
<ui-carousel class="mx-auto w-full max-w-xs">
  <ui-carousel-content>
    <ui-carousel-item>1</ui-carousel-item>
    <ui-carousel-item>2</ui-carousel-item>
  </ui-carousel-content>
  <ui-carousel-previous></ui-carousel-previous>
  <ui-carousel-next></ui-carousel-next>
</ui-carousel>
```

| Input / output | Type / values | Default |
|---|---|---|
| `opts` | `Record<string, any>` | `{}` |
| `plugins` | `any[]` | `[]` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ready` (output) | `EmblaCarouselType` |  |

Parts (selectors): `div[uiCarousel], ui-carousel`, `div[uiCarouselContent], ui-carousel-content`, `div[uiCarouselItem], ui-carousel-item`, `button[uiCarouselPrevious], ui-carousel-previous`, `button[uiCarouselNext], ui-carousel-next`.

Spec: `docs/behavior-specs/carousel.md` · Manual test: `docs/manual-tests/carousel.md`
