export const SPECS = {
  attachment: {
    parts: [
      { slot: 'attachment-group' },
      { slot: 'attachment', dims: { size: 'data-size', orientation: 'data-orientation' }, attrOnly: { state: { attr: 'data-state', values: ['idle', 'uploading', 'processing', 'done'], default: 'done' } } },
      { slot: 'attachment-media', dims: { variant: 'data-variant' }, defaults: { variant: 'icon' } },
      { slot: 'attachment-content' },
      { slot: 'attachment-title', selector: 'span[uiAttachmentTitle]' },
      { slot: 'attachment-description', selector: 'span[uiAttachmentDescription]' },
      { slot: 'attachment-actions' },
      { slot: 'attachment-trigger', classOnly: true },
    ],
  },
  bubble: {
    parts: [
      { slot: 'bubble', dims: { variant: 'data-variant', align: 'data-align' }, defaults: { variant: 'default', align: 'start' } },
      { slot: 'bubble-content' },
      { slot: 'bubble-group' },
      { slot: 'bubble-reactions', dims: { align: 'data-align', side: 'data-side' }, defaults: { align: 'start', side: 'bottom' }, host: { role: 'img' } },
    ],
  },
  marker: {
    parts: [
      { slot: 'marker', dims: { variant: 'data-variant' }, defaults: { variant: 'default' }, host: { role: 'status' } },
      { slot: 'marker-icon', selector: 'span[uiMarkerIcon]', host: { 'aria-hidden': 'true' } },
      { slot: 'marker-content', selector: 'span[uiMarkerContent]' },
    ],
  },
  message: {
    parts: [
      { slot: 'message', dims: { align: 'data-align' }, defaults: { align: 'start' } },
      { slot: 'message-avatar' },
      { slot: 'message-content' },
      { slot: 'message-footer' },
      { slot: 'message-group' },
      { slot: 'message-header' },
    ],
  },
  'message-scroller': {
    parts: [
      { slot: 'message-scroller', classOnly: true },
      { slot: 'message-scroller-viewport', classOnly: true },
      { slot: 'message-scroller-content', classOnly: true },
      { slot: 'message-scroller-item', classOnly: true },
      { slot: 'message-scroller-button', classOnly: true },
    ],
  },
  questionnaire: {
    parts: [
      { slot: 'questionnaire', classOnly: true },
      { slot: 'questionnaire-progress', classOnly: true },
      { slot: 'questionnaire-item', classOnly: true },
      { slot: 'questionnaire-title', classOnly: true },
      { slot: 'questionnaire-description', classOnly: true },
      { slot: 'questionnaire-choices', classOnly: true },
      { slot: 'questionnaire-choice', classOnly: true },
      { slot: 'questionnaire-choice-input', classOnly: true },
      { slot: 'questionnaire-choice-indicator', classOnly: true },
      { slot: 'questionnaire-choice-indicator-dot', classOnly: true },
      { slot: 'questionnaire-choice-label', classOnly: true },
      { slot: 'questionnaire-choice-shortcut', classOnly: true },
      { slot: 'questionnaire-input-wrapper', classOnly: true },
      { slot: 'questionnaire-input', classOnly: true },
      { slot: 'questionnaire-error', classOnly: true },
      { slot: 'questionnaire-actions', classOnly: true },
    ],
  },
};
