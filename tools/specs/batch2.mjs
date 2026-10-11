export const SPECS = {
  kbd: {
    parts: [
      { slot: 'kbd', selector: 'kbd[uiKbd]', drop: ['translate-x-0.5'] },
      { slot: 'kbd-group', selector: 'kbd[uiKbdGroup]' },
    ],
  },
  skeleton: { parts: [{ slot: 'skeleton', drop: ['aspect-video', 'w-full'] }] },
  textarea: { parts: [{ slot: 'textarea', selector: 'textarea[uiTextarea]' }] },
  table: {
    parts: [
      { slot: 'table-container' },
      { slot: 'table', selector: 'table[uiTable]' },
      { slot: 'table-caption', selector: 'caption[uiTableCaption]' },
      { slot: 'table-header', selector: 'thead[uiTableHeader]' },
      { slot: 'table-body', selector: 'tbody[uiTableBody]' },
      { slot: 'table-footer', selector: 'tfoot[uiTableFooter]' },
      { slot: 'table-row', selector: 'tr[uiTableRow]' },
      { slot: 'table-head', selector: 'th[uiTableHead]' },
      { slot: 'table-cell', selector: 'td[uiTableCell]' },
    ],
  },
  'native-select': {
    // wrapper + icon are hand-written (native-select.manual.ts)
    parts: [
      { slot: 'native-select', selector: 'select[uiNativeSelect]', attrOnly: { size: { attr: 'data-size', values: ['default', 'sm'], default: 'default' } } },
      { slot: 'native-select-option', selector: 'option[uiNativeSelectOption]' },
      { slot: 'native-select-optgroup', selector: 'optgroup[uiNativeSelectOptgroup]' },
    ],
  },
  pagination: {
    parts: [
      { slot: 'pagination', selector: 'nav[uiPagination]', host: { role: 'navigation', 'aria-label': 'pagination' } },
      { slot: 'pagination-content', selector: 'ul[uiPaginationContent]' },
      { slot: 'pagination-item', selector: 'li[uiPaginationItem]' },
    ],
  },
};
