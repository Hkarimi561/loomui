export const SPECS = {
  'aspect-ratio': { parts: [{ slot: 'aspect-ratio', classOnly: true, drop: ['rounded-lg', 'bg-muted'] }] },
  'input-otp': {
    parts: [
      { slot: 'input-otp-group', classOnly: true, drop: ['*:data-[slot=input-otp-slot]:h-12', '*:data-[slot=input-otp-slot]:w-11', '*:data-[slot=input-otp-slot]:text-xl'] },
      { slot: 'input-otp-slot', classOnly: true },
      { slot: 'input-otp-separator', classOnly: true, drop: ['mx-2'] },
    ],
  },
  'scroll-area': {
    parts: [
      { slot: 'scroll-area', classOnly: true, drop: ['h-72', 'w-48', 'rounded-md', 'border'] },
      { slot: 'scroll-area-viewport', classOnly: true },
    ],
  },
  resizable: {
    parts: [
      { slot: 'resizable-panel-group', classOnly: true, drop: ['max-w-sm', 'rounded-lg', 'border', 'min-h-[200px]'] },
      { slot: 'resizable-handle', classOnly: true },
    ],
  },
};
