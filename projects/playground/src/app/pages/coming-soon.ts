import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButton } from '@loomui/ui/button';
import { COMPONENTS } from '../components.data';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink, UiButton],
  template: `
    <h1 class="mb-2 text-2xl font-semibold">{{ name() }}</h1>
    <p class="mb-4 text-muted-foreground">Not implemented yet. It follows Button in the build order.</p>
    <a uiButton variant="outline" routerLink="/components/button">Back to Button</a>
  `,
})
export class ComingSoonPage {
  readonly slug = input.required<string>();
  readonly name = computed(() => COMPONENTS.find((c) => c.slug === this.slug())?.name ?? this.slug());
}
