// Generates class-only Angular directives from captured shadcn slot evidence.
//   node tools/gen-ui.mjs <component> [<component> ...]
// Evidence: docs/evidence/slots/<component>.json (from REA DOM captures); specs: tools/ui-specs.mjs.
//
// Per part, the spec may use:
//   dims:      { input: 'data-attr' }  derive cva variants from observed data-* attributes
//   baseAs:    { input: 'value' }      class strings WITHOUT the attribute are treated as this value
//   attrOnly:  { input: { attr, values, default } }  data attribute input, classes handled by CSS selectors in `base`
//   variants:  { input: { value: 'classes' } }  hand-written cva variants (+ optional `attr` map) overriding derivation
//   base:      string                  hand-written base classes (skips consensus)
//   drop:      string[]                tokens to remove (demo-only overrides)
//   host:      { name: 'value' }       constant host attributes
import fs from 'node:fs';
import path from 'node:path';
import { SPECS } from './ui-specs.mjs';

const root = path.resolve(import.meta.dirname, '..');
const NL = '\n';

// physical -> logical (RTL support)
const LOGICAL = [
  [/^pl-/, 'ps-'], [/^pr-/, 'pe-'], [/^ml-/, 'ms-'], [/^mr-/, 'me-'], [/^-ml-/, '-ms-'], [/^-mr-/, '-me-'],
  [/^left-/, 'start-'], [/^right-/, 'end-'], [/^text-left$/, 'text-start'], [/^text-right$/, 'text-end'],
  [/^rounded-l(-|$)/, 'rounded-s$1'], [/^rounded-r(-|$)/, 'rounded-e$1'],
  [/^rounded-tl(-|$)/, 'rounded-ss$1'], [/^rounded-tr(-|$)/, 'rounded-se$1'],
  [/^rounded-bl(-|$)/, 'rounded-es$1'], [/^rounded-br(-|$)/, 'rounded-ee$1'],
  [/^border-l(-|$)/, 'border-s$1'], [/^border-r(-|$)/, 'border-e$1'],
];
function logicalTok(tok) {
  // keep arbitrary-variant prefixes intact: split on the last ':' that is not inside [...]
  let depth = 0, cut = -1;
  for (let i = 0; i < tok.length; i++) {
    const c = tok[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (c === ':' && depth === 0) cut = i;
  }
  const head = cut >= 0 ? tok.slice(0, cut + 1) : '';
  let util = cut >= 0 ? tok.slice(cut + 1) : tok;
  const bang = util.endsWith('!') ? '!' : '';
  if (bang) util = util.slice(0, -1);
  if (!/^(-?left|-?right)-1\/2$/.test(util)) for (const [re, rep] of LOGICAL) util = util.replace(re, rep);
  return head + util + bang;
}

/** Tokens present in at least half of the distinct class strings (drops demo-only overrides). */
function consensus(strings, drop = []) {
  const sets = strings.map((s) => s.split(/\s+/).filter(Boolean).map(logicalTok));
  const count = new Map();
  for (const set of sets) for (const t of new Set(set)) count.set(t, (count.get(t) ?? 0) + 1);
  const need = Math.ceil(sets.length / 2);
  const order = [];
  for (const set of sets) for (const t of set) if (!order.includes(t)) order.push(t);
  return order.filter((t) => count.get(t) >= need && !drop.includes(t));
}

const pascal = (s) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const key = (v) => (/^[A-Za-z_$][\w$]*$/.test(v) ? v : q(v));

function genPart(part, ev) {
  const e = ev[part.slot];
  if (!e) throw new Error(`no evidence for slot ${part.slot}`);
  const drop = part.drop ?? [];
  const cls = part.directive ?? `Ui${pascal(part.slot)}`;
  if (part.classOnly) {
    const allS = Object.values(e.sets).flat();
    const b = part.base ?? consensus(allS, part.drop ?? []).join(' ');
    return { out: `export const ${camel(part.slot)}Class =${NL}  ${q(b)};${NL}`, cls: null, hasCva: false };
  }
  const selector = part.selector ?? `[ui${pascal(part.slot)}]`;
  const host = { 'data-slot': part.slot, ...(part.host ?? {}) };

  /** @type {Record<string, Record<string,string>>} */
  let variants = {};
  /** @type {Record<string,string>} input -> data attribute (bound on host) */
  const attrs = {};
  /** @type {Record<string,string[]>} */
  const valueSets = {};
  const defaults = { ...(part.defaults ?? {}) };
  let base;

  const allStrings = Object.values(e.sets).flat();
  if (part.variants) {
    base = part.base ?? consensus(allStrings, drop).join(' ');
    variants = part.variants;
    Object.assign(attrs, part.dimAttrs ?? {});
  } else if (part.dims) {
    // derive variants per dimension from observed data-* attributes
    const reps = {};
    for (const k of Object.keys(e.sets)) reps[k] = consensus(e.sets[k], drop);
    const repList = Object.values(reps);
    const common = repList[0].filter((t) => repList.every((r) => r.includes(t)));
    base = part.base ?? common.join(' ');
    for (const [input, attr] of Object.entries(part.dims)) {
      attrs[input] = attr;
      const perVal = {};
      for (const [k, rep] of Object.entries(reps)) {
        const m = k.split('|').find((p) => p.startsWith(attr + '='));
        const val = m ? m.slice(attr.length + 1) : part.baseAs?.[input];
        if (val === undefined) continue;
        const own = rep.filter((t) => !common.includes(t));
        perVal[val] = perVal[val] === undefined ? own : perVal[val].filter((t) => own.includes(t));
      }
      variants[input] = Object.fromEntries(Object.entries(perVal).map(([v, t]) => [v, t.join(' ')]));
    }
  } else {
    base = part.base ?? consensus(allStrings, drop).join(' ');
  }
  for (const [input, spec] of Object.entries(part.attrOnly ?? {})) {
    attrs[input] = spec.attr;
    valueSets[input] = spec.values;
    defaults[input] = spec.default ?? spec.values[0];
  }
  for (const [input, vs] of Object.entries(variants)) {
    valueSets[input] = Object.keys(vs);
    defaults[input] ??= part.defaults?.[input] ?? Object.keys(vs)[0];
  }

  const hasCva = Object.keys(variants).length > 0;
  const varName = `${camel(part.slot)}Variants`;
  let top = '';
  if (hasCva) {
    top =
      `export const ${varName} = cva(${q(base)}, {${NL}  variants: {${NL}` +
      Object.entries(variants)
        .map(([input, vs]) => `    ${key(input)}: {${NL}${Object.entries(vs).map(([v, c]) => `      ${key(v)}: ${q(c)},`).join(NL)}${NL}    },`)
        .join(NL) +
      `${NL}  },${NL}  defaultVariants: { ${Object.keys(variants).map((i) => `${i}: ${q(defaults[i])}`).join(', ')} },${NL}});${NL}${NL}`;
  }
  const inputs = Object.keys(valueSets)
    .map((i) => `  readonly ${i} = input<${valueSets[i].map(q).join(' | ')}>(${q(defaults[i])});`)
    .join(NL);
  const hostLines = [
    ...Object.entries(host).map(([k, v]) => `    ${q(k)}: ${q(v)},`),
    ...Object.entries(part.hostExtra ?? {}).map(([k, v]) => `    ${q(k)}: ${q(v)},`),
    ...Object.entries(attrs).map(([i, a]) => `    ${q(`[attr.${a}]`)}: ${q(`${i}()`)},`),
    `    '[attr.class]': 'classes()',`,
  ];
  const classExpr = hasCva
    ? `cn(${varName}({ ${Object.keys(variants).map((i) => `${i}: this.${i}()`).join(', ')} }), this.userClass())`
    : `cn(${q(base)}, this.userClass())`;
  const out =
    `${top}${part.doc ? `/** ${part.doc} */${NL}` : ''}@Directive({${NL}  selector: ${q(selector)},${NL}  host: {${NL}${hostLines.join(NL)}${NL}  },${NL}})${NL}` +
    `export class ${cls} {${NL}${inputs ? inputs + NL : ''}  readonly userClass = input<string>('', { alias: 'class' });${NL}` +
    `  protected readonly classes = computed(() => ${classExpr});${NL}${part.members ?? ''}}${NL}`;
  return { out, cls, hasCva };
}

for (const name of process.argv.slice(2)) {
  const spec = SPECS[name];
  if (!spec) throw new Error(`no spec for ${name}`);
  const ev = JSON.parse(fs.readFileSync(path.join(root, 'docs/evidence/slots', `${spec.evidence ?? name}.json`), 'utf8'));
  const parts = spec.parts.map((p) => genPart(p, ev));
  const header =
    `// GENERATED by tools/gen-ui.mjs from docs/evidence/slots/${spec.evidence ?? name}.json.${NL}` +
    `// Change tools/ui-specs.mjs and regenerate; hand-written parts live in ./${name}.manual.ts.${NL}` +
    `import { ${[...new Set(['computed', 'Directive', 'input', ...spec.parts.flatMap((p) => p.imports ?? [])])].sort().join(', ')} } from '@angular/core';${NL}` +
    `${parts.some((p) => p.hasCva) ? `import { cva } from 'class-variance-authority';${NL}` : ''}` +
    `import { cn } from '@loomui-ng/ui/utils';${NL}${NL}`;
  const names = parts.map((p) => p.cls).filter(Boolean);
  const dir = path.join(root, 'libs/ui', name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${name}.ts`),
    header + parts.map((p) => p.out).join(NL) + `${NL}export const UI_${name.toUpperCase().replace(/-/g, '_')}_GENERATED = [${names.join(', ')}] as const;${NL}`,
  );
  const manual = fs.existsSync(path.join(dir, `${name}.manual.ts`));
  if (!manual) fs.appendFileSync(path.join(dir, `${name}.ts`), `export const UI_${name.toUpperCase().replace(/-/g, '_')} = UI_${name.toUpperCase().replace(/-/g, '_')}_GENERATED;${NL}`);
  const shared = fs.existsSync(path.join(dir, `${name}.shared.ts`));
  fs.writeFileSync(path.join(dir, 'index.ts'), `export * from './${name}';${NL}${shared ? `export * from './${name}.shared';${NL}` : ''}${manual ? `export * from './${name}.manual';${NL}` : ''}`);
  fs.writeFileSync(path.join(dir, 'ng-package.json'), JSON.stringify({ lib: { entryFile: 'index.ts' } }, null, 2) + NL);
  console.log(`generated libs/ui/${name}/${name}.ts (${names.join(', ')})`);
}

// Keep the custom-element form (alias selector + UiElementHost) on regenerated files.
await import('./add-elements.mjs');
