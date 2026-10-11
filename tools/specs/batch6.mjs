export const SPECS = {
  'alert-dialog': {
    parts: [
      { slot: 'alert-dialog-overlay', classOnly: true },
      { slot: 'alert-dialog-content', classOnly: true },
      { slot: 'alert-dialog-header', classOnly: true },
      { slot: 'alert-dialog-title', classOnly: true, drop: ['cn-font-heading'] },
      { slot: 'alert-dialog-description', classOnly: true },
      { slot: 'alert-dialog-footer', classOnly: true },
    ],
  },
  drawer: {
    parts: [
      { slot: 'drawer-overlay', classOnly: true },
      { slot: 'drawer-content', classOnly: true },
      { slot: 'drawer-header', classOnly: true },
      { slot: 'drawer-title', classOnly: true, drop: ['cn-font-heading'] },
      { slot: 'drawer-description', classOnly: true },
      { slot: 'drawer-footer', classOnly: true },
    ],
  },
};
