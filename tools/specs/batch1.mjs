// Specs for tools/gen-ui.mjs (see header of that file for the option meanings).
export const SPECS = {
  alert: {
    parts: [
      {
        slot: 'alert',
        host: { role: 'alert' },
        drop: ['max-w-md'],
        // Variants differ by classes only (no data attribute) on the live site.
        variants: { variant: { default: '', destructive: 'text-destructive *:data-[slot=alert-description]:text-destructive/90' } },
        defaults: { variant: 'default' },
      },
      { slot: 'alert-title' },
      { slot: 'alert-description' },
      { slot: 'alert-action' },
    ],
  },
  avatar: {
    // UiAvatar / UiAvatarImage / UiAvatarFallback are hand-written (load/error state) in avatar.manual.ts
    parts: [
      { slot: 'avatar-badge', drop: ['bg-green-600', 'dark:bg-green-800', 'bg-primary'] },
      { slot: 'avatar-group' },
      { slot: 'avatar-group-count' },
    ],
  },
  breadcrumb: {
    parts: [
      { slot: 'breadcrumb', selector: 'nav[uiBreadcrumb]', host: { 'aria-label': 'breadcrumb' } },
      { slot: 'breadcrumb-list', selector: 'ol[uiBreadcrumbList]' },
      { slot: 'breadcrumb-item', selector: 'li[uiBreadcrumbItem]' },
      { slot: 'breadcrumb-link', selector: 'a[uiBreadcrumbLink]' },
      { slot: 'breadcrumb-page', selector: 'span[uiBreadcrumbPage]', host: { role: 'link', 'aria-disabled': 'true', 'aria-current': 'page' } },
    ],
  },
  'button-group': {
    parts: [
      { slot: 'button-group', dims: { orientation: 'data-orientation' }, baseAs: { orientation: 'horizontal' }, defaults: { orientation: 'horizontal' }, host: { role: 'group' }, drop: ['hidden', 'sm:flex'] },
      { slot: 'button-group-separator', attrOnly: { orientation: { attr: 'data-orientation', values: ['horizontal', 'vertical'], default: 'horizontal' } }, host: { role: 'none' } },
    ],
  },
  empty: {
    parts: [
      { slot: 'empty', drop: ['border', 'h-full', 'bg-muted/30'] },
      { slot: 'empty-header' },
      { slot: 'empty-icon', dims: { variant: 'data-variant' }, defaults: { variant: 'default' } },
      { slot: 'empty-title' },
      { slot: 'empty-description', drop: ['max-w-xs', 'text-pretty'] },
      { slot: 'empty-content', drop: ['flex-row', 'justify-center', 'gap-2', 'flex-col', 'gap-2.5'] },
    ],
  },
  field: {
    parts: [
      { slot: 'field-group', drop: ['gap-5', 'gap-3', 'max-w-xs'] },
      { slot: 'field-set', selector: 'fieldset[uiFieldSet]', drop: ['w-full', 'max-w-xs', 'max-w-sm'] },
      { slot: 'field-legend', selector: 'legend[uiFieldLegend]', attrOnly: { variant: { attr: 'data-variant', values: ['legend', 'label'], default: 'legend' } } },
      { slot: 'field-description' },
      { slot: 'field', dims: { orientation: 'data-orientation' }, defaults: { orientation: 'vertical' }, host: { role: 'group' }, drop: ['max-w-xs', 'w-fit', 'w-full'] },
      { slot: 'field-label', selector: 'label[uiFieldLabel]' },
      { slot: 'field-content' },
    ],
  },
  'input-group': {
    parts: [
      { slot: 'input-group', host: { role: 'group' }, drop: ['max-w-xs', 'max-w-sm', 'h-auto', '[--radius:9999px]'] },
      { slot: 'input-group-control', selector: 'input[uiInputGroupControl]' },
      {
        slot: 'input-group-addon',
        dims: { align: 'data-align' },
        defaults: { align: 'inline-start' },
        host: { role: 'group' },
        hostExtra: { '(click)': 'onClick($event)' },
        imports: ['ElementRef', 'inject'],
        members: `  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Clicking the addon (not a button inside it) focuses the control, like shadcn. */
  protected onClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).closest('button')) return;
    this.el.parentElement?.querySelector<HTMLElement>('[data-slot=input-group-control]')?.focus();
  }
`,
      },
    ],
  },
  item: {
    parts: [
      {
        slot: 'item',
        base: 'group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted',
        variants: {
          variant: { default: 'border-transparent', outline: 'border-border', muted: 'border-transparent bg-muted/50' },
          size: { default: 'gap-2.5 px-3 py-2.5', sm: 'gap-2.5 px-3 py-2.5', xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0' },
        },
        dimAttrs: { variant: 'data-variant', size: 'data-size' },
        defaults: { variant: 'default', size: 'default' },
      },
      { slot: 'item-content', drop: ['flex-1', 'flex-none', 'text-center'] },
      { slot: 'item-title' },
      { slot: 'item-description' },
      { slot: 'item-actions' },
      { slot: 'item-media', dims: { variant: 'data-variant' }, defaults: { variant: 'default' } },
      { slot: 'item-group', host: { role: 'list' }, drop: ['max-w-sm', 'grid', 'grid-cols-3'] },
      { slot: 'item-header' },
    ],
  },
};
