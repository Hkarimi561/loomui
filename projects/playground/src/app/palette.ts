import { embedUrl } from './embed-url';
import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UI_COMMAND } from '@loomui-ng/ui/command';
import { UI_DIALOG } from '@loomui-ng/ui/dialog';
import { UiIcon } from '@loomui-ng/ui/icon';
import './icons';
import { CATEGORIES, COMPONENTS } from './components.data';

/**
 * ⌘K / Ctrl+K quick switcher built from our own Dialog + Command. On wide screens the highlighted component is previewed
 * live (its real demo in a scaled iframe, loaded after the highlight settles for ~250 ms).
 */
@Component({
  selector: 'app-palette',
  imports: [UI_DIALOG, UI_COMMAND, UiIcon],
  template: `
    <div uiDialog [(open)]="open" class="contents">
      <div uiDialogContent [showCloseButton]="false" class="gap-0 overflow-hidden p-0 sm:max-w-4xl" aria-label="Jump to component">
        <h2 uiDialogTitle class="sr-only">Jump to component</h2>
        <p uiDialogDescription class="sr-only">Type to filter components, press Enter to open one. A live preview appears on the right.</p>
        <div class="grid md:grid-cols-[minmax(0,1fr)_21rem]">
          <div uiCommand class="rounded-none border-0 bg-transparent">
            <div
              uiCommandInputWrapper
              class="p-3 pb-2 [&>div]:h-11 [&>div]:gap-3 [&>div]:rounded-xl [&>div]:border-border/60 [&>div]:bg-muted/40 [&>div]:px-3.5 [&>div]:shadow-sm [&>div]:transition-[box-shadow,border-color,background-color] [&>div]:duration-200 [&>div:focus-within]:border-primary/50 [&>div:focus-within]:bg-background/60 [&>div:focus-within]:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_16%,transparent),0_8px_24px_-8px_color-mix(in_oklab,var(--primary)_45%,transparent)] [&_svg]:size-[18px] [&_svg]:text-primary [&_svg]:opacity-80 [&_input]:text-[15px]"
            >
              <input uiCommandInput placeholder="Search components…" />
            </div>
            <div uiCommandList class="max-h-[26rem] [&_[data-slot=command-group]+[data-slot=command-group]]:mt-4 [&_[data-slot=command-group]:first-child]:mt-0 [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-1">
              <div uiCommandEmpty>No component found.</div>
              <div uiCommandGroup heading="Pages">
                <div uiCommandItem value="Home landing" (select)="go('/')">Home</div>
                <div uiCommandItem value="Get started install guide" [keywords]="['install', 'setup', 'cli', 'npm']" (select)="go('/get-started')">Get started</div>
                <div uiCommandItem value="All components gallery" (select)="go('/components')">All components</div>
                <div uiCommandItem value="Themes accent colors" [keywords]="['theme', 'accent', 'color']" (select)="go('/themes')">Themes</div>
                <div uiCommandItem value="Custom elements" [keywords]="['element', 'ui-button', 'web component']" (select)="go('/elements')">Custom elements</div>
                <div uiCommandItem value="Icons lucide" [keywords]="['icon', 'lucide', 'svg']" (select)="go('/icons')">Icons</div>
              </div>
              @for (cat of categories; track cat) {
                <div uiCommandGroup [heading]="cat">
                  @for (c of byCategory(cat); track c.slug) {
                    <div uiCommandItem [value]="c.name" [attr.data-slug]="c.slug" [keywords]="[c.blurb, c.category, c.slug]" (select)="go('/components/' + c.slug)">
                      {{ c.name }}
                      <span class="ms-auto truncate ps-3 text-xs text-muted-foreground md:hidden">{{ c.blurb }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- live preview -->
          <aside class="hidden border-s bg-muted/30 md:flex md:flex-col" aria-label="Preview" aria-live="polite">
            @if (current(); as c) {
              <div class="border-b px-4 py-3">
                <p class="font-medium">{{ c.name }}</p>
                <p class="text-xs text-muted-foreground">{{ c.blurb }}</p>
              </div>
              <div class="relative m-3 h-60 overflow-hidden rounded-lg border bg-background">
                @if (src(); as s) {
                  <iframe [src]="s" [title]="c.name + ' preview'" class="pointer-events-none absolute start-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0" tabindex="-1"></iframe>
                } @else {
                  <div class="grid size-full place-items-center text-xs text-muted-foreground">Loading preview…</div>
                }
              </div>
              <p class="mt-auto flex items-center gap-1.5 px-4 pb-3 text-xs text-muted-foreground">
                <kbd class="rounded border bg-background px-1.5 font-mono">↵</kbd> open <kbd class="ms-2 rounded border bg-background px-1.5 font-mono">↑↓</kbd> navigate
              </p>
            } @else {
              <div class="grid flex-1 place-items-center p-6 text-center text-sm text-muted-foreground">
                <div class="grid justify-items-center gap-2"><ui-icon name="eye" class="size-6" /> Highlight a component to preview it.</div>
              </div>
            }
          </aside>
        </div>
      </div>
    </div>
  `,
})
export class Palette {
  readonly open = model(false);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  readonly categories = CATEGORIES;

  /** Slug of the highlighted command item once it has settled; drives the preview. */
  private readonly slug = signal<string | null>(null);
  readonly current = computed(() => COMPONENTS.find((c) => c.slug === this.slug()) ?? null);
  readonly src = computed<SafeResourceUrl | null>(() => (this.slug() ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl(this.slug()!)) : null));

  constructor() {
    let observer: MutationObserver | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    effect((onCleanup) => {
      if (!this.open()) {
        this.slug.set(null);
        return;
      }
      // Watch the highlight (`data-selected`) inside the command list once the overlay has rendered.
      const attach = setTimeout(() => {
        const list = document.querySelector('.cdk-overlay-container [data-slot=command-list]');
        if (!list) return;
        const read = () => {
          const el = list.querySelector<HTMLElement>('[data-slot=command-item][data-selected=true]');
          const next = el?.dataset['slug'] ?? null;
          clearTimeout(timer);
          timer = setTimeout(() => this.slug.set(next), next ? 250 : 0);
        };
        observer = new MutationObserver(read);
        observer.observe(list, { attributes: true, attributeFilter: ['data-selected'], subtree: true });
        read();
      }, 150);
      onCleanup(() => {
        clearTimeout(attach);
        clearTimeout(timer);
        observer?.disconnect();
      });
    });
  }

  byCategory(cat: string) {
    return COMPONENTS.filter((c) => c.category === cat);
  }

  go(url: string): void {
    this.open.set(false);
    this.router.navigateByUrl(url);
  }
}
