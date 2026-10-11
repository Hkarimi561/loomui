import { embedUrl } from '../embed-url';
import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { UiIcon } from '@loomui-ng/ui/icon';
import '../icons';
import { COMPONENTS } from '../components.data';

const READY = COMPONENTS.filter((c) => c.status === 'ready');

/** A featured component that rotates daily (deterministic per UTC day), with its real demo in a framed preview. */
@Component({
  selector: 'app-component-of-day',
  imports: [RouterLink, UiIcon],
  template: `
    <div class="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div class="flex flex-wrap items-center gap-3 border-b bg-muted/40 px-4 py-3">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <ui-icon name="sparkles" /> {{ shuffled() ? 'Random pick' : 'Component of the day' }}
        </span>
        <h3 class="text-lg font-semibold tracking-tight">{{ pick().name }}</h3>
        <span class="hidden text-sm text-muted-foreground sm:inline">{{ pick().blurb }}</span>
        <div class="ms-auto flex items-center gap-2">
          <button type="button" class="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-2.5 text-xs font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" (click)="shuffle()">
            <ui-icon name="shuffle" /> Shuffle
          </button>
          <a [routerLink]="['/components', pick().slug]" class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
            Open page <ui-icon name="arrow-right" class="rtl:rotate-180" />
          </a>
        </div>
      </div>
      <div class="relative h-[26rem] bg-background">
        @if (visible() && src(); as s) {
          <iframe [src]="s" [title]="pick().name + ' live demo'" class="size-full border-0" loading="lazy"></iframe>
        } @else {
          <div class="grid size-full place-items-center text-sm text-muted-foreground" aria-hidden="true">Loading preview…</div>
        }
      </div>
    </div>
  `,
})
export class ComponentOfDay {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly shuffled = signal(false);
  private readonly index = signal(Math.floor(Date.now() / 86_400_000) * 7919);
  readonly pick = computed(() => READY[Math.abs(this.index()) % READY.length]);
  /** Only load the iframe once the section is near the viewport (keeps the landing page light). */
  readonly visible = signal(false);
  readonly src = computed<SafeResourceUrl | null>(() => this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl(this.pick().slug)));

  constructor() {
    afterNextRender(() => {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            this.visible.set(true);
            io.disconnect();
          }
        },
        { rootMargin: '200px' },
      );
      io.observe(this.el);
      this.destroyRef.onDestroy(() => io.disconnect());
    });
  }

  shuffle(): void {
    this.shuffled.set(true);
    this.index.set(Math.floor(Math.random() * READY.length * 100));
  }
}
