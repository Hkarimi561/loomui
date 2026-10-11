import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UI_ASPECT_RATIO } from '@loomui/ui/aspect-ratio';
import { UI_INPUT_OTP } from '@loomui/ui/input-otp';
import { UI_RESIZABLE } from '@loomui/ui/resizable';
import { UI_SCROLL_AREA } from '@loomui/ui/scroll-area';

@Component({
  selector: 'app-aspect-ratio-page',
  imports: [UI_ASPECT_RATIO],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Aspect Ratio</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/aspect-ratio.md</p>
    <div class="grid max-w-sm gap-6">
      <div uiAspectRatio [ratio]="16 / 9" class="rounded-lg bg-muted"><div class="grid size-full place-items-center text-sm text-muted-foreground">16 / 9</div></div>
      <div uiAspectRatio [ratio]="1" class="w-32 rounded-lg bg-muted"><div class="grid size-full place-items-center text-sm text-muted-foreground">1 / 1</div></div>
    </div>
  `,
})
export class AspectRatioPage {}

@Component({
  selector: 'app-input-otp-page',
  imports: [UI_INPUT_OTP, ReactiveFormsModule],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Input OTP</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/input-otp.md</p>
    <div class="grid gap-6">
      <div uiInputOtp [maxLength]="6" [(value)]="code" (complete)="done.set($event)">
        <div uiInputOtpGroup>
          @for (i of [0, 1, 2]; track i) {
            <div uiInputOtpSlot [index]="i"></div>
          }
        </div>
        <div uiInputOtpSeparator></div>
        <div uiInputOtpGroup>
          @for (i of [3, 4, 5]; track i) {
            <div uiInputOtpSlot [index]="i"></div>
          }
        </div>
      </div>
      <p class="text-sm text-muted-foreground">value = "{{ code() }}" · complete = "{{ done() }}"</p>
      <div uiInputOtp [maxLength]="4" pattern="^[a-zA-Z0-9]+$" [formControl]="ctrl">
        <div uiInputOtpGroup>
          @for (i of [0, 1, 2, 3]; track i) {
            <div uiInputOtpSlot [index]="i"></div>
          }
        </div>
      </div>
      <div uiInputOtp [maxLength]="4" invalid disabled>
        <div uiInputOtpGroup>
          @for (i of [0, 1, 2, 3]; track i) {
            <div uiInputOtpSlot [index]="i"></div>
          }
        </div>
      </div>
    </div>
  `,
})
export class InputOtpPage {
  readonly code = signal('');
  readonly done = signal('');
  readonly ctrl = new FormControl('ab1');
}

@Component({
  selector: 'app-scroll-area-page',
  imports: [UI_SCROLL_AREA],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Scroll Area</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/scroll-area.md</p>
    <div uiScrollArea class="h-72 w-48 rounded-md border">
      <div uiScrollAreaViewport>
        <div class="p-4">
          <h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
          @for (t of tags; track t) {
            <div class="text-sm">{{ t }}</div>
            <div class="my-2 h-px bg-border"></div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ScrollAreaPage {
  readonly tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${50 - i}`);
}

@Component({
  selector: 'app-resizable-page',
  imports: [UI_RESIZABLE],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Resizable</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/resizable.md</p>
    <div class="grid max-w-md gap-8">
      <div uiResizablePanelGroup direction="horizontal" class="min-h-[200px] rounded-lg border">
        <div uiResizablePanel [defaultSize]="50"><div class="flex h-full items-center justify-center p-6"><span class="font-semibold">One</span></div></div>
        <div uiResizableHandle></div>
        <div uiResizablePanel [defaultSize]="50">
          <div uiResizablePanelGroup direction="vertical">
            <div uiResizablePanel [defaultSize]="25"><div class="flex h-full items-center justify-center p-6"><span class="font-semibold">Two</span></div></div>
            <div uiResizableHandle withHandle></div>
            <div uiResizablePanel [defaultSize]="75"><div class="flex h-full items-center justify-center p-6"><span class="font-semibold">Three</span></div></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResizablePage {}
