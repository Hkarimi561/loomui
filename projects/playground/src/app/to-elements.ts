import { ELEMENT_ATTRS } from './elements.generated';

const VOID = new Set(['input', 'img', 'br', 'hr']);

/**
 * Rewrites directive markup into custom-element markup:
 *   <button uiButton variant="outline" uiDialogTrigger>Go</button>  →  <ui-button variant="outline" uiDialogTrigger>Go</ui-button>
 * The first Loom UI attribute on a tag becomes the element name; further directive attributes stay as attributes (they still
 * match on the custom element). Native-control wrappers collapse (`<div uiNativeSelectWrapper><select uiNativeSelect>` →
 * `<ui-native-select>`). Tags without a Loom UI attribute are left alone.
 */
export function toElements(html: string): string {
  // <div uiNativeSelectWrapper> <select uiNativeSelect …> … </select> </div>  →  <ui-native-select …> … </ui-native-select>
  let src = html.replace(
    /<div\s+uiNativeSelectWrapper[^>]*>\s*<select\s+uiNativeSelect([^>]*)>([\s\S]*?)<\/select>\s*<\/div>/g,
    (_m, attrs: string, inner: string) => `<ui-native-select${attrs}>${inner}</ui-native-select>`,
  );
  src = src.replace(/(<option\b[^>]*?)\s+uiNativeSelectOption\b/g, '$1').replace(/(<optgroup\b[^>]*?)\s+uiNativeSelectOptgroup\b/g, '$1');

  const stack: (string | null)[] = [];
  return src.replace(/<(\/?)([a-zA-Z][\w-]*)((?:\s+(?:"[^"]*"|'[^']*'|[^<>"'])*?)?)(\/?)>/g, (m, close: string, tag: string, attrs: string, self: string) => {
    if (close) {
      const top = stack.pop();
      return top ? `</${top}>` : m;
    }
    let alias: string | null = null;
    let rest = attrs;
    const re = /(\s)(ui[A-Za-z0-9]+)(="[^"]*"|='[^']*')?(?=[\s/>]|$)/g;
    let found: RegExpExecArray | null;
    while ((found = re.exec(attrs))) {
      const a = ELEMENT_ATTRS[found[2]];
      if (!a) continue;
      alias = a;
      // `uiTypography="lead"` → `variant="lead"`
      const replacement = found[2] === 'uiTypography' && found[3] ? ` variant${found[3]}` : '';
      rest = attrs.slice(0, found.index) + replacement + attrs.slice(found.index + found[0].length);
      break;
    }
    if (!alias) {
      if (!self && !VOID.has(tag)) stack.push(null);
      return m;
    }
    if (!self && !VOID.has(tag)) stack.push(alias);
    return `<${alias}${rest.replace(/\s+$/, '')}${self ? ' /' : ''}>`;
  });
}
