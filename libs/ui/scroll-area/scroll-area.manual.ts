import { computed, Directive, input } from '@angular/core';
import { cn } from '@loomui-ng/ui/utils';
import { scrollAreaClass, scrollAreaViewportClass } from './scroll-area';
import { UiElementHost } from '@loomui-ng/ui/utils';

/**
 * <div uiScrollArea class="h-72 w-48 rounded-md border"><div uiScrollAreaViewport>…long content…</div></div>
 *
 * Deviation: Radix draws custom overlay scrollbars (`scroll-area-scrollbar` / `scroll-area-thumb`, mounted on demand and not
 * present in the captured idle DOM). This version scrolls natively and styles the native thin scrollbar instead.
 */
@Directive({
  selector: '[uiScrollArea], ui-scroll-area', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'scroll-area', '[attr.class]': 'classes()' },
})
export class UiScrollArea {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn(scrollAreaClass, this.userClass()));
}

@Directive({
  selector: '[uiScrollAreaViewport], ui-scroll-area-viewport', hostDirectives: [UiElementHost],
  host: { 'data-slot': 'scroll-area-viewport', tabindex: '0', '[attr.class]': 'classes()' },
})
export class UiScrollAreaViewport {
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      scrollAreaViewportClass,
      'overflow-auto [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]',
      this.userClass(),
    ),
  );
}

export const UI_SCROLL_AREA = [UiScrollArea, UiScrollAreaViewport] as const;
