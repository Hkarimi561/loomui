import { Component, signal } from '@angular/core';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_DIRECTION } from '@loomui-ng/ui/direction';
import { UI_DROPDOWN_MENU } from '@loomui-ng/ui/dropdown-menu';
import { UI_TABS } from '@loomui-ng/ui/tabs';
import { UI_TYPOGRAPHY } from '@loomui-ng/ui/typography';

@Component({
  selector: 'app-typography-page',
  imports: [UI_TYPOGRAPHY],
  template: `
    <h1 uiTypography="h1">Typography</h1>
    <p uiTypography="lead" class="mt-2">Classic typography styles as a directive and an element.</p>
    <h2 uiTypography="h2" class="mt-10">Heading two</h2>
    <p uiTypography="p">The king, seeing how much happier his subjects were, realized the error of his ways.</p>
    <h3 uiTypography="h3" class="mt-8">Heading three</h3>
    <blockquote uiTypography="blockquote">"After all," he said, "everyone enjoys a good joke."</blockquote>
    <h4 uiTypography="h4" class="mt-8">Heading four</h4>
    <ul uiTypography="list"><li>1st level of puns: 5 gold coins</li><li>2nd level of jokes: 10 gold coins</li></ul>
    <p uiTypography="p">Use <code uiTypography="code">&#64;radix-ui/react-alert-dialog</code> inline. <small uiTypography="small">Small text.</small></p>
    <div uiTypography="large">Are you absolutely sure?</div>
    <p uiTypography="muted">Enter your email address.</p>
  `,
})
export class TypographyPage {}

@Component({
  selector: 'app-direction-page',
  imports: [UI_DIRECTION, UI_TABS, UI_DROPDOWN_MENU, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Direction</h1>
    <p class="mb-6 text-muted-foreground">Scoped direction provider. Spec: docs/behavior-specs/direction.md</p>
    <div class="grid max-w-md gap-4">
      <button uiButton variant="outline" (click)="dir.set(dir() === 'rtl' ? 'ltr' : 'rtl')">Direction: {{ dir() }}</button>
      <div [uiDirection]="dir()" class="grid gap-4 rounded-lg border p-4">
        <div uiTabs value="a">
          <div uiTabsList>
            <button uiTabsTrigger value="a">Account</button>
            <button uiTabsTrigger value="b">Password</button>
          </div>
          <div uiTabsContent value="a">Account tab content</div>
          <div uiTabsContent value="b">Password tab content</div>
        </div>
        <div uiDropdownMenu class="contents">
          <button uiButton variant="outline" uiDropdownMenuTrigger>Menu</button>
          <div uiDropdownMenuContent>
            <div uiDropdownMenuItem>One</div>
            <div uiDropdownMenuItem>Two</div>
            <div uiDropdownMenuSub>
              <div uiDropdownMenuSubTrigger>More</div>
              <div uiDropdownMenuSubContent><div uiDropdownMenuItem>Nested</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DirectionPage {
  readonly dir = signal<'ltr' | 'rtl'>('rtl');
}
