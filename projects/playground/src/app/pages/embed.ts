import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, signal, Type, viewChild } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PAGE_LOADERS } from './registry';

/**
 * Bare demo for the resizable preview iframe (`/embed/<slug>`): no header or sidebar, so the page's real viewport width is
 * the width the user chose and responsive breakpoints behave exactly like on a device. Reports its height to the parent.
 */
@Component({
  selector: 'app-embed',
  imports: [NgComponentOutlet],
  template: `
    <div #box class="demo-stage p-5">
      @if (cmp(); as c) {
        <ng-container *ngComponentOutlet="c" />
      }
    </div>
  `,
})
export class EmbedPage {
  readonly slug = input.required<string>();
  readonly cmp = signal<Type<unknown> | null>(null);
  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');

  constructor() {
    queueMicrotask(async () => {
      const load = PAGE_LOADERS[this.slug()];
      if (load) this.cmp.set((await load()) as Type<unknown>);
    });
    afterNextRender(() => {
      const el = this.box().nativeElement;
      const post = () => parent.postMessage({ type: 'loom-embed-height', slug: this.slug(), h: Math.ceil(el.getBoundingClientRect().height) + 8 }, '*');
      const ro = new ResizeObserver(post);
      ro.observe(el);
      post();
      inject(DestroyRef).onDestroy(() => ro.disconnect());
    });
  }
}
