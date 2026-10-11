import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { UiToastService } from '@loomui-ng/ui/toast';
import '../icons';
import { UiIcon } from '@loomui-ng/ui/icon';

export interface CodeTab {
  label: string;
  file: string;
  code: string;
}

/** Tiny single-pass HTML/TS highlighter (one regex, so emitted markup is never re-tokenised). Input is escaped first. */
export function highlight(line: string): string {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const re = /(&lt;!--[\s\S]*?--&gt;|\/\/[^\n]*|#[^\n]*)|("[^"\n]*"|'[^'\n]*')|(&lt;\/?)([a-zA-Z][\w-]*)|\b(import|from|export|class|const|readonly|inject|imports|template|selector|new|npx|npm)\b/g;
  return esc.replace(re, (_m, comment, str, lt, tag, kw) => {
    if (comment) return '<span class="text-muted-foreground/70 italic">' + comment + '</span>';
    if (str) return '<span class="text-emerald-600 dark:text-emerald-400">' + str + '</span>';
    if (tag) return lt + '<span class="text-rose-600 dark:text-rose-400">' + tag + '</span>';
    return '<span class="text-violet-600 dark:text-violet-400">' + kw + '</span>';
  });
}

const COLORS = ['#6366f1', '#22d3ee', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

/** macOS-style code window: filename tabs, line numbers, copy button with a tiny confetti burst. */
@Component({
  selector: 'app-code-card',
  imports: [UiIcon],
  template: `
    <figure class="overflow-hidden rounded-xl border bg-muted/30">
      <figcaption class="flex items-center gap-3 border-b bg-muted/50 px-3 py-2">
        <span class="hidden gap-1.5 sm:flex" aria-hidden="true">
          <i class="size-2.5 rounded-full bg-red-400/80"></i><i class="size-2.5 rounded-full bg-amber-400/80"></i><i class="size-2.5 rounded-full bg-emerald-400/80"></i>
        </span>
        <div role="tablist" [attr.aria-label]="label()" class="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          @for (t of tabs(); track t.label; let i = $index) {
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="i === active()"
              class="shrink-0 rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              [class]="i === active() ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'"
              (click)="active.set(i)"
            >
              {{ t.file }}
            </button>
          }
        </div>
        <button
          type="button"
          class="relative grid size-8 shrink-0 place-items-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
          (click)="copy()"
        >
          @if (copied()) {
            <ui-icon name="check" class="pop size-4 text-emerald-500" strokeWidth="2.5" />
            @for (p of particles; track $index) {
              <i class="confetti" [style.background]="p.c" [style.--dx]="p.dx" [style.--dy]="p.dy" [style.--rot]="p.rot"></i>
            }
          } @else {
            <ui-icon name="copy" class="size-4" />
          }
        </button>
      </figcaption>
      <pre dir="ltr" class="max-h-[30rem] overflow-auto py-3 text-[13px] leading-relaxed"><code class="grid">@for (l of lines(); track $index; let i = $index) {<span class="flex px-4 hover:bg-foreground/5"><span class="w-8 shrink-0 pe-3 text-end text-muted-foreground/50 select-none" aria-hidden="true">{{ i + 1 }}</span><span class="whitespace-pre" [innerHTML]="l"></span></span>}</code></pre>
    </figure>
  `,
})
export class CodeCard {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(UiToastService);
  readonly tabs = input.required<CodeTab[]>();
  readonly label = input('Code');
  readonly active = signal(0);
  readonly copied = signal(false);
  readonly particles = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    const d = 18 + (i % 3) * 7;
    return { c: COLORS[i % COLORS.length], dx: `${Math.cos(a) * d}px`, dy: `${Math.sin(a) * d}px`, rot: `${i * 70}deg` };
  });

  readonly lines = computed<SafeHtml[]>(() => {
    const t = this.tabs()[Math.min(this.active(), this.tabs().length - 1)];
    return (t?.code ?? '').split('\n').map((l) => this.sanitizer.bypassSecurityTrustHtml(highlight(l) || ' '));
  });

  copy(): void {
    const t = this.tabs()[this.active()];
    if (!t) return;
    navigator.clipboard?.writeText(t.code).then(
      () => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1400);
      },
      () => this.toast.error('Could not copy'),
    );
  }
}
