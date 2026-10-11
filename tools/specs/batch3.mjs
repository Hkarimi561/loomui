// classOnly parts emit `<slot>Class` constants; behavior lives in libs/ui/<c>/<c>.manual.ts
export const SPECS = {
  accordion: {
    parts: [
      { slot: 'accordion', classOnly: true, drop: ['max-w-lg', 'rounded-lg', 'border'] },
      { slot: 'accordion-item', classOnly: true },
      { slot: 'accordion-trigger', classOnly: true },
      { slot: 'accordion-content', classOnly: true },
    ],
  },
  collapsible: {
    parts: [
      { slot: 'collapsible', classOnly: true },
      { slot: 'collapsible-content', classOnly: true },
    ],
  },
  'toggle-group': {
    parts: [
      { slot: 'toggle-group', classOnly: true },
      { slot: 'toggle-group-item', classOnly: true },
    ],
  },
  'radio-group': {
    parts: [
      { slot: 'radio-group', classOnly: true, drop: ['max-w-sm'] },
      { slot: 'radio-group-item', classOnly: true },
      { slot: 'radio-group-indicator', classOnly: true },
    ],
  },
  slider: {
    parts: [
      { slot: 'slider', classOnly: true, drop: ['mx-auto', 'max-w-xs', 'h-40'] },
      { slot: 'slider-track', classOnly: true },
      { slot: 'slider-range', classOnly: true },
      { slot: 'slider-thumb', classOnly: true },
    ],
  },
};
