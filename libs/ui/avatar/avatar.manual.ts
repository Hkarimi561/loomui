import { computed, Directive, ElementRef, inject, input, signal, ChangeDetectionStrategy, Component } from '@angular/core';
import { cva } from 'class-variance-authority';
import { cn } from '@loomui/ui/utils';
import { UI_AVATAR_GENERATED } from './avatar';
import { UiElementHost } from '@loomui/ui/utils';

const AVATAR_CLASS =
  'group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten';

/**
 * <span uiAvatar size="lg"><img uiAvatarImage src="…" alt="@shadcn" /><span uiAvatarFallback>CN</span></span>
 * Image load/error state is tracked here so the fallback shows only while the image is not loaded (Radix Avatar behavior).
 */
@Directive({
  selector: '[uiAvatar], ui-avatar', hostDirectives: [UiElementHost],
  exportAs: 'uiAvatar',
  host: { 'data-slot': 'avatar', '[attr.data-size]': 'size()', '[attr.class]': 'classes()' },
})
export class UiAvatar {
  readonly size = input<'default' | 'sm' | 'lg'>('default');
  readonly userClass = input<string>('', { alias: 'class' });
  readonly status = signal<'loading' | 'loaded' | 'error'>('loading');
  protected readonly classes = computed(() => cn(AVATAR_CLASS, this.userClass()));
}

@Directive({
  selector: 'img[uiAvatarImage]',
  host: {
    'data-slot': 'avatar-image',
    '[hidden]': 'avatar.status() !== "loaded"',
    '[attr.class]': 'classes()',
    '(load)': 'avatar.status.set("loaded")',
    '(error)': 'avatar.status.set("error")',
  },
})
export class UiAvatarImage {
  protected readonly avatar = inject(UiAvatar);
  private readonly el = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() => cn('aspect-square size-full rounded-full object-cover', this.userClass()));

  constructor() {
    // The image may already be complete (cached) before the listener is attached.
    queueMicrotask(() => {
      if (this.el.complete && this.el.naturalWidth > 0) this.avatar.status.set('loaded');
      else if (this.el.complete && this.el.src) this.avatar.status.set('error');
    });
  }
}

// avatar-fallback was not rendered on the captured page (images loaded), so these classes are UNKNOWN on the live site;
// they follow shadcn's published source (see docs/behavior-specs/avatar.md).
@Directive({
  selector: '[uiAvatarFallback], ui-avatar-fallback', hostDirectives: [UiElementHost],
  host: {
    'data-slot': 'avatar-fallback',
    '[hidden]': 'avatar.status() === "loaded"',
    '[attr.class]': 'classes()',
  },
})
export class UiAvatarFallback {
  protected readonly avatar = inject(UiAvatar);
  readonly userClass = input<string>('', { alias: 'class' });
  protected readonly classes = computed(() =>
    cn(
      'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs',
      this.userClass(),
    ),
  );
}

/** <ui-avatar-image src="/me.png" alt="Me" /> — custom-element form of `<img uiAvatarImage>` (the real <img> lives inside). */
@Component({
  selector: 'ui-avatar-image',
  imports: [UiAvatarImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `<img uiAvatarImage [class]="userClass()" [attr.src]="src() || null" [attr.alt]="alt()" [attr.srcset]="srcset() || null" [attr.sizes]="sizes() || null" />`,
})
export class UiAvatarImageElement {
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly srcset = input<string>('');
  readonly sizes = input<string>('');
  readonly userClass = input<string>('', { alias: 'class' });
}

export const UI_AVATAR = [UiAvatar, UiAvatarImage, UiAvatarImageElement, UiAvatarFallback, ...UI_AVATAR_GENERATED] as const;
void cva;
