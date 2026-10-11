export const SPECS = {
  'navigation-menu': {
    parts: [
      { slot: 'navigation-menu', classOnly: true, drop: ['max-w-max'] },
      { slot: 'navigation-menu-list', classOnly: true },
      { slot: 'navigation-menu-item', classOnly: true },
      { slot: 'navigation-menu-trigger', classOnly: true },
      { slot: 'navigation-menu-content', classOnly: true },
      { slot: 'navigation-menu-link', classOnly: true },
      { slot: 'navigation-menu-viewport', classOnly: true },
    ],
  },
  combobox: {
    parts: [
      { slot: 'combobox-trigger', classOnly: true },
      { slot: 'combobox-content', classOnly: true, drop: ['cn-menu-target', 'cn-menu-translucent'] },
      { slot: 'combobox-list', classOnly: true },
      { slot: 'combobox-item', classOnly: true },
      { slot: 'combobox-empty', classOnly: true },
      { slot: 'combobox-chips', classOnly: true },
      { slot: 'combobox-chip', classOnly: true },
      { slot: 'combobox-chip-input', classOnly: true },
      { slot: 'combobox-clear', classOnly: true },
    ],
  },
};
