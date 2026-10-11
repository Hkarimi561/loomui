export const SPECS = {
  'context-menu': {
    parts: [
      { slot: 'context-menu-trigger', classOnly: true },
      { slot: 'context-menu-content', classOnly: true, drop: ['cn-menu-target', 'cn-menu-translucent'] },
      { slot: 'context-menu-item', classOnly: true },
      { slot: 'context-menu-sub-trigger', classOnly: true },
      { slot: 'context-menu-checkbox-item', classOnly: true },
      { slot: 'context-menu-radio-item', classOnly: true },
      { slot: 'context-menu-label', classOnly: true },
      { slot: 'context-menu-separator', classOnly: true },
      { slot: 'context-menu-shortcut', classOnly: true },
    ],
  },
  menubar: {
    parts: [
      { slot: 'menubar', classOnly: true, drop: ['w-72'] },
      { slot: 'menubar-trigger', classOnly: true },
      { slot: 'menubar-content', classOnly: true, drop: ['cn-menu-target', 'cn-menu-translucent'] },
      { slot: 'menubar-item', classOnly: true },
      { slot: 'menubar-sub-trigger', classOnly: true },
      { slot: 'menubar-separator', classOnly: true },
      { slot: 'menubar-shortcut', classOnly: true },
    ],
  },
};
