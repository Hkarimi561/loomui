import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_CARD } from '@loomui-ng/ui/card';
import { UI_INPUT } from '@loomui-ng/ui/input';
import { highlight } from './code-card';

const CODE = `<ui-card>
  <ui-card-header>
    <ui-card-title>Create project</ui-card-title>
    <ui-card-description>Deploy in one click.</ui-card-description>
  </ui-card-header>
  <ui-card-content>
    <ui-input placeholder="Project name" />
  </ui-card-content>
  <ui-card-footer>
    <ui-button variant="outline">Cancel</ui-button>
    <ui-button>Deploy</ui-button>
  </ui-card-footer>
</ui-card>`;

/** Position (in characters) after which each part of the live result appears. */
const lineEnd = (n: number) => CODE.split('\n').slice(0, n).join('\n').length;
const STEPS = { card: lineEnd(1), header: lineEnd(5), content: lineEnd(8), footer: lineEnd(12) };

/** Code types itself out while the real components it describes appear next to it. Starts when scrolled into view. */
@Component({
  selector: 'app-typed-code',
  imports: [UI_CARD, UI_INPUT, UiButton],
  template: `
    <div class="grid items-center gap-6 md:grid-cols-2">
      <figure class="overflow-hidden rounded-xl border bg-muted/30" dir="ltr">
        <figcaption class="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
          <span class="flex gap-1.5" aria-hidden="true"><i class="size-2.5 rounded-full bg-red-400/80"></i><i class="size-2.5 rounded-full bg-amber-400/80"></i><i class="size-2.5 rounded-full bg-emerald-400/80"></i></span>
          <span class="font-mono text-xs text-muted-foreground">deploy.component.html</span>
        </figcaption>
        <pre class="min-h-[22rem] overflow-x-auto p-4 text-[13px] leading-relaxed" aria-label="Example code"><code [innerHTML]="html()"></code></pre>
      </figure>

      <div class="grid place-items-center rounded-xl border bg-card/40 p-6" aria-label="Live result">
        <div class="reveal-step w-full max-w-xs" [class.on]="typed() >= steps.card">
          <ui-card>
            <ui-card-header class="reveal-step" [class.on]="typed() >= steps.header">
              <ui-card-title>Create project</ui-card-title>
              <ui-card-description>Deploy in one click.</ui-card-description>
            </ui-card-header>
            <ui-card-content class="reveal-step" [class.on]="typed() >= steps.content">
              <ui-input placeholder="Project name" aria-label="Project name" />
            </ui-card-content>
            <ui-card-footer class="reveal-step gap-2" [class.on]="typed() >= steps.footer">
              <ui-button variant="outline">Cancel</ui-button>
              <ui-button>Deploy</ui-button>
            </ui-card-footer>
          </ui-card>
        </div>
      </div>
    </div>
  `,
})
export class TypedCode {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  readonly steps = STEPS;
  readonly typed = signal(0);
  private readonly done = computed(() => this.typed() >= CODE.length);

  readonly html = computed<SafeHtml>(() => {
    const text = CODE.slice(0, this.typed());
    return this.sanitizer.bypassSecurityTrustHtml(highlight(text) + (this.done() ? '' : '<span class="caret"></span>'));
  });

  constructor() {
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.typed.set(CODE.length);
        return;
      }
      // Time-based (not tick-based): typing speed does not depend on timer throttling, only on elapsed time.
      let visible = false;
      let raf = 0;
      let last = 0;
      let carry = 0; // fractional characters
      let rest = 0; // ms spent resting after the code is complete
      const CPS = 55; // characters per second
      const frame = (now: number) => {
        raf = 0;
        if (!visible) {
          last = 0;
          return;
        }
        const dt = last ? Math.min(100, now - last) : 16;
        last = now;
        if (this.typed() >= CODE.length) {
          rest += dt;
          if (rest > 4500) {
            rest = 0;
            this.typed.set(0);
          }
        } else {
          carry += (dt / 1000) * CPS * (CODE[this.typed()] === '\n' ? 0.4 : 1);
          const n = Math.floor(carry);
          if (n > 0) {
            carry -= n;
            this.typed.set(Math.min(CODE.length, this.typed() + n));
          }
        }
        raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (!raf) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
      }, { threshold: 0.3 });
      io.observe(this.el);
      this.destroyRef.onDestroy(() => {
        io.disconnect();
        if (raf) cancelAnimationFrame(raf);
      });
    });
  }
}
