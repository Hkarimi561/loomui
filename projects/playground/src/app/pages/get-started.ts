import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import '../icons';
import { UiIcon } from '@loomui-ng/ui/icon';
import { CodeCard, type CodeTab } from './code-card';

interface Step {
  title: string;
  text: string;
  tabs: CodeTab[];
}

const APP_TS = (imp: string) =>
  `import { Component } from '@angular/core';
import { UiButton } from '${imp}';

@Component({
  selector: 'app-root',
  imports: [UiButton],
  template: \`
    <button uiButton>Hello Loom UI</button>
    <ui-button variant="outline">As a custom element</ui-button>
  \`,
})
export class App {}`;

/** First-run guide: from an empty Angular app to a rendered Loom UI button. */
@Component({
  selector: 'app-get-started-page',
  imports: [RouterLink, UiIcon, CodeCard],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Get started</h1>
        <p class="mt-2 text-muted-foreground">
          From an empty Angular app to your first Loom UI component in about five minutes. You need Node 20+, Angular 22 and Tailwind CSS v4 (step 2).
        </p>
      </header>

      <div class="mb-3 inline-flex rounded-lg border bg-muted/40 p-1" role="tablist" aria-label="Installation method">
        @for (m of methods; track m.id) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="method() === m.id"
            class="rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            [class]="method() === m.id ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'"
            (click)="method.set(m.id)"
          >
            {{ m.label }}
          </button>
        }
      </div>
      <p class="mb-10 text-sm text-muted-foreground">
        @if (method() === 'cli') {
          The CLI copies the source into your project, so you own and can edit every component. Recommended.
        } @else {
          The package keeps the components in node_modules; you update them with npm.
        }
      </p>

      <ol class="grid gap-10">
        @for (s of steps(); track s.title) {
          <li class="grid gap-3 md:grid-cols-[2rem_minmax(0,1fr)] md:gap-4">
            <span class="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{{ $index + 1 }}</span>
            <div class="min-w-0">
              <h2 class="text-lg font-semibold tracking-tight">{{ s.title }}</h2>
              <p class="mt-1 mb-3 text-sm text-muted-foreground">{{ s.text }}</p>
              <app-code-card [tabs]="s.tabs" [label]="s.title" />
            </div>
          </li>
        }
      </ol>

      <section class="mt-14 rounded-2xl border bg-card p-6">
        <h2 class="text-lg font-semibold tracking-tight">Good to know</h2>
        <ul class="mt-3 grid gap-2 text-sm text-muted-foreground">
          <li>
            <strong class="text-foreground">Dark mode:</strong> add <code class="rounded bg-muted px-1 font-mono text-xs">class="dark"</code> to
            <code class="rounded bg-muted px-1 font-mono text-xs">&lt;html&gt;</code>. Accent presets use
            <code class="rounded bg-muted px-1 font-mono text-xs">class="theme-blue"</code> (see <a routerLink="/themes" class="underline underline-offset-2 hover:text-foreground">Themes</a>).
          </li>
          <li>
            <strong class="text-foreground">Directives or elements:</strong> every component works as
            <code class="rounded bg-muted px-1 font-mono text-xs">&lt;button uiButton&gt;</code> and as
            <code class="rounded bg-muted px-1 font-mono text-xs">&lt;ui-button&gt;</code>; mix freely (<a routerLink="/elements" class="underline underline-offset-2 hover:text-foreground">Custom elements</a>).
          </li>
          <li><strong class="text-foreground">Icons:</strong> Lucide through <code class="rounded bg-muted px-1 font-mono text-xs">&lt;ui-icon&gt;</code> (<a routerLink="/icons" class="underline underline-offset-2 hover:text-foreground">Icon browser</a>).</li>
          <li>
            <strong class="text-foreground">Optional packages:</strong> <code class="rounded bg-muted px-1 font-mono text-xs">embla-carousel</code> (Carousel),
            <code class="rounded bg-muted px-1 font-mono text-xs">chart.js</code> (Chart), <code class="rounded bg-muted px-1 font-mono text-xs">&#64;tanstack/angular-table</code> (Data Table).
          </li>
          <li>
            <strong class="text-foreground">CLI options:</strong> <code class="rounded bg-muted px-1 font-mono text-xs">--dir</code>,
            <code class="rounded bg-muted px-1 font-mono text-xs">--css</code>, <code class="rounded bg-muted px-1 font-mono text-xs">--overwrite</code>,
            <code class="rounded bg-muted px-1 font-mono text-xs">--no-install</code>; <code class="rounded bg-muted px-1 font-mono text-xs">npx &#64;loomui-ng/cli list</code> shows every component.
          </li>
        </ul>
        <a routerLink="/components" class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Browse all components <ui-icon name="arrow-right" class="size-4 rtl:rotate-180" />
        </a>
      </section>
    </div>
  `,
})
export class GetStartedPage {
  readonly methods = [
    { id: 'cli', label: 'CLI (copy the code)' },
    { id: 'npm', label: 'npm package' },
  ] as const;
  readonly method = signal<'cli' | 'npm'>('cli');

  private readonly create: Step = {
    title: 'Create an Angular app',
    text: 'Skip this if you already have an Angular 22 project.',
    tabs: [{ label: 'Terminal', file: 'terminal', code: '# a new app (standalone, CSS)\nnpm install -g @angular/cli\nng new my-app --style=css\ncd my-app' }],
  };

  private readonly tailwind: Step = {
    title: 'Add Tailwind CSS v4',
    text: 'Loom UI is styled with Tailwind utility classes, so Tailwind has to be set up first.',
    tabs: [
      { label: 'Terminal', file: 'terminal', code: 'npm install tailwindcss @tailwindcss/postcss postcss' },
      { label: '.postcssrc.json', file: '.postcssrc.json', code: '{\n  "plugins": {\n    "@tailwindcss/postcss": {}\n  }\n}' },
      { label: 'styles.css', file: 'src/styles.css', code: "@import 'tailwindcss';" },
    ],
  };

  private readonly cli: Step[] = [
    {
      title: 'Initialise Loom UI',
      text: 'Writes loomui.json, copies the theme (loomui.css) and the cn() helper, and installs clsx, tailwind-merge and tw-animate-css for you.',
      tabs: [{ label: 'Terminal', file: 'terminal', code: 'npx @loomui-ng/cli init' }],
    },
    {
      title: 'Add components',
      text: 'Each component lands in src/app/ui/<name>/ together with the components it depends on. Add as many as you need, or use --all.',
      tabs: [{ label: 'Terminal', file: 'terminal', code: 'npx @loomui-ng/cli add button dialog input\n\n# see everything available\nnpx @loomui-ng/cli list' }],
    },
    {
      title: 'Use it',
      text: 'Import from the copied folder and use the directive or the custom element.',
      tabs: [{ label: 'app.ts', file: 'src/app/app.ts', code: APP_TS('./ui/button') }],
    },
  ];

  private readonly npm: Step[] = [
    {
      title: 'Install the package',
      text: 'Install Loom UI together with its peer dependencies.',
      tabs: [{ label: 'Terminal', file: 'terminal', code: 'npm install @loomui-ng/ui @angular/cdk lucide class-variance-authority clsx tailwind-merge tw-animate-css' }],
    },
    {
      title: 'Import the theme',
      text: 'One import adds the design tokens, custom variants and overlay styles, and tells Tailwind to scan the package.',
      tabs: [{ label: 'styles.css', file: 'src/styles.css', code: "@import 'tailwindcss';\n@import '@loomui-ng/ui/styles/loomui.css';" }],
    },
    {
      title: 'Use it',
      text: 'Each component is its own entry point, so you only ship what you import.',
      tabs: [{ label: 'app.ts', file: 'src/app/app.ts', code: APP_TS('@loomui-ng/ui/button') }],
    },
  ];

  readonly steps = computed(() => [this.create, this.tailwind, ...(this.method() === 'cli' ? this.cli : this.npm)]);
}
