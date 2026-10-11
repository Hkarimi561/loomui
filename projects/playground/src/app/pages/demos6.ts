import { Component, signal } from '@angular/core';
import { UI_ATTACHMENT } from '@loomui-ng/ui/attachment';
import { UI_BUBBLE } from '@loomui-ng/ui/bubble';
import { UiButton } from '@loomui-ng/ui/button';
import { UI_CALENDAR, DateRange } from '@loomui-ng/ui/calendar';
import { UI_MARKER } from '@loomui-ng/ui/marker';
import { UI_MESSAGE } from '@loomui-ng/ui/message';
import { UI_MESSAGE_SCROLLER } from '@loomui-ng/ui/message-scroller';
import { UI_QUESTIONNAIRE } from '@loomui-ng/ui/questionnaire';

@Component({
  selector: 'app-bubble-page',
  imports: [UI_BUBBLE],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Bubble</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/bubble.md</p>
    <div uiBubbleGroup class="max-w-md">
      <div uiBubble variant="muted"><div uiBubbleContent>Hello! How can I help?</div></div>
      <div uiBubble align="end"><div uiBubbleContent>Show me the latest invoices.</div></div>
      <div uiBubble variant="outline"><div uiBubbleContent>Outline</div></div>
      <div uiBubble variant="destructive"><div uiBubbleContent>Destructive</div></div>
    </div>
  `,
})
export class BubblePage {}

@Component({
  selector: 'app-marker-page',
  imports: [UI_MARKER],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Marker</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/marker.md</p>
    <div class="grid max-w-md gap-4">
      <div uiMarker><span uiMarkerContent>Today</span></div>
      <div uiMarker variant="separator"><span uiMarkerContent>New messages</span></div>
      <div uiMarker variant="border"><span uiMarkerContent>Yesterday</span></div>
    </div>
  `,
})
export class MarkerPage {}

@Component({
  selector: 'app-message-page',
  imports: [UI_MESSAGE, UI_BUBBLE],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Message</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/message.md</p>
    <div uiMessageGroup class="max-w-md">
      <div uiMessage>
        <div uiMessageContent>
          <div uiMessageHeader>Assistant</div>
          <div uiBubble variant="muted"><div uiBubbleContent>Here is your summary.</div></div>
          <div uiMessageFooter>10:42</div>
        </div>
      </div>
      <div uiMessage align="end">
        <div uiMessageContent><div uiBubble align="end"><div uiBubbleContent>Thanks!</div></div></div>
      </div>
    </div>
  `,
})
export class MessagePage {}

@Component({
  selector: 'app-attachment-page',
  imports: [UI_ATTACHMENT],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Attachment</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/attachment.md</p>
    <div uiAttachmentGroup class="max-w-md">
      @for (f of files(); track f) {
        <div uiAttachment>
          <div uiAttachmentContent>
            <div uiAttachmentTitle>{{ f }}</div>
            <div uiAttachmentDescription>24 KB</div>
          </div>
          <button uiAttachmentAction [attr.aria-label]="'Remove ' + f" (click)="remove(f)">×</button>
        </div>
      }
    </div>
  `,
})
export class AttachmentPage {
  readonly files = signal(['workspace.png', 'notes.pdf', 'data.csv']);
  remove(f: string) {
    this.files.update((l) => l.filter((x) => x !== f));
  }
}

@Component({
  selector: 'app-message-scroller-page',
  imports: [UI_MESSAGE_SCROLLER, UI_BUBBLE, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Message Scroller</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/message-scroller.md</p>
    <div uiMessageScroller class="h-80 max-w-md rounded-lg border">
      <div uiMessageScrollerViewport>
        <div uiMessageScrollerContent class="p-3">
          @for (m of msgs(); track m) {
            <div uiMessageScrollerItem [messageId]="'m' + m">
              <div uiBubble [align]="m % 2 ? 'end' : 'start'"><div uiBubbleContent>Message {{ m }}</div></div>
            </div>
          }
        </div>
      </div>
      <button uiMessageScrollerButton aria-label="Scroll to latest"></button>
    </div>
    <button uiButton variant="outline" class="mt-4" (click)="add()">Add message</button>
  `,
})
export class MessageScrollerPage {
  readonly msgs = signal(Array.from({ length: 15 }, (_, i) => i + 1));
  add() {
    this.msgs.update((l) => [...l, l.length + 1]);
  }
}

@Component({
  selector: 'app-questionnaire-page',
  imports: [UI_QUESTIONNAIRE, UiButton],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Questionnaire</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/questionnaire.md</p>
    <form uiQuestionnaire #q="uiQuestionnaire" (submitted)="result.set(json($event))">
      <div uiQuestionnaireProgress></div>
      <fieldset uiQuestionnaireItem name="plan" required>
        <legend uiQuestionnaireTitle>Pick a plan</legend>
        <div uiQuestionnaireChoices>
          <label uiQuestionnaireChoice value="free">Free</label>
          <label uiQuestionnaireChoice value="pro">Pro</label>
        </div>
      </fieldset>
      <fieldset uiQuestionnaireItem name="tags" multiple>
        <legend uiQuestionnaireTitle>Interests</legend>
        <div uiQuestionnaireChoices>
          <label uiQuestionnaireChoice value="ui">UI</label>
          <label uiQuestionnaireChoice value="a11y">Accessibility</label>
        </div>
      </fieldset>
      <fieldset uiQuestionnaireItem name="note">
        <legend uiQuestionnaireTitle>Anything else?</legend>
        <div uiQuestionnaireInput placeholder="Type here"></div>
      </fieldset>
      <div uiQuestionnaireActions>
        <button uiButton variant="ghost" type="button" [disabled]="q.isFirst()" (click)="q.previous()">Back</button>
        <button uiButton variant="outline" type="button" [class.hidden]="q.isLast()" (click)="q.skip()">Skip</button>
        <button uiButton type="button" (click)="q.isLast() ? q.submit() : q.next()">{{ q.isLast() ? 'Submit' : 'Next' }}</button>
      </div>
    </form>
    @if (result()) {
      <pre class="mt-4 rounded-md bg-muted p-3 text-xs">{{ result() }}</pre>
    }
  `,
})
export class QuestionnairePage {
  readonly result = signal('');
  json(v: unknown) {
    return JSON.stringify(v, null, 2);
  }
}

@Component({
  selector: 'app-calendar-page',
  imports: [UI_CALENDAR],
  template: `
    <h1 class="mb-1 text-2xl font-semibold">Calendar</h1>
    <p class="mb-6 text-muted-foreground">Spec: docs/behavior-specs/calendar.md</p>
    <div class="flex flex-wrap gap-8">
      <div uiCalendar mode="single" [(selected)]="date" class="rounded-lg border"></div>
      <div uiCalendar mode="range" [(selected)]="range" [numberOfMonths]="2" class="rounded-lg border"></div>
    </div>
    <p class="mt-4 text-sm text-muted-foreground">Selected: {{ date() }}</p>
  `,
})
export class CalendarPage {
  readonly date = signal<Date | undefined>(new Date());
  readonly range = signal<DateRange | undefined>(undefined);
}
