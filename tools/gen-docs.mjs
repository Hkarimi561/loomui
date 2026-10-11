// Generates docs/behavior-specs/<c>.md, docs/manual-tests/<c>.md and libs/ui/<c>/README.md for the components described in
// tools/docs-data/*.mjs. Structure tables come from the REA evidence (docs/evidence/slots/<c>.json); keys listed as
// "handled in code" and the parts table are grepped from the implementation, so docs cannot claim keys that do not exist.
//   node tools/gen-docs.mjs [component ...]
import fs from 'node:fs';
import path from 'node:path';
import { toElements } from './to-elements.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dataDir = path.join(root, 'tools/docs-data');
const DOCS = {};
for (const f of fs.readdirSync(dataDir).filter((f) => f.endsWith('.mjs'))) Object.assign(DOCS, (await import(`./docs-data/${f}`)).default);

const only = process.argv.slice(2);
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Escape', 'Enter', 'Tab', 'Backspace', 'Delete'];

const libFiles = (c) =>
  fs.readdirSync(path.join(root, 'libs/ui', c)).filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => fs.readFileSync(path.join(root, 'libs/ui', c, f), 'utf8'));

function codeKeys(c) {
  const src = libFiles(c).join('\n');
  const found = KEYS.filter((k) => src.includes(`'${k}'`) || src.includes(`"${k}"`) || new RegExp(`case '${k}'`).test(src));
  if (/key === ' '|case ' '|'Space'/.test(src)) found.push('Space');
  return found;
}

function parts(c) {
  const src = libFiles(c).join('\n');
  return [...src.matchAll(/selector:\s*'([^']+)'/g)].map((m) => m[1]);
}

function autoApi(c) {
  const src = libFiles(c).join('\n');
  const seen = new Set();
  const rows = [];
  const re = /readonly (\w+) = (input|model|output)(\.required)?(?:<([^(]*?)>)?\(([^\n]*)/g;
  for (const m of src.matchAll(re)) {
    const [, name, kind, req, type, rest] = m;
    if (name === 'userClass' || seen.has(name)) continue;
    seen.add(name);
    const first = rest.split(/,\s*\{|\)/)[0].trim();
    const label = '`' + name + '`' + (kind === 'model' ? ' (model)' : kind === 'output' ? ' (output)' : '');
    const typ = type ? '`' + type.replace(/\|/g, '\\|') + '`' : '';
    rows.push([label, typ, req ? 'required' : first && kind !== 'output' ? '`' + first.replace(/\|/g, '\\|') + '`' : '']);
  }
  return rows;
}

const apiTable = (rows) =>
  rows.length ? ['| Input / output | Type / values | Default |', '|---|---|---|', ...rows.map(([a, b, e]) => `| ${a} | ${b} | ${e} |`)].join('\n') + '\n' : '';

function constName(c) {
  const idx = fs.readFileSync(path.join(root, 'libs/ui', c, 'index.ts'), 'utf8');
  const src = libFiles(c).join('\n');
  const m = src.match(/export const (UI_[A-Z_]+)\b(?!_GENERATED)/);
  return m ? m[1] : null;
}

function evidence(c) {
  const file = path.join(root, 'docs/evidence/slots', `${c}.json`);
  if (!fs.existsSync(file)) return null;
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const rows = Object.entries(j)
    .filter(([k]) => !k.startsWith('_'))
    .map(([slot, v]) => {
      const attrs = Object.entries(v.attrs ?? {})
        .map(([n, vals]) => `${n}=${(Array.isArray(vals) ? vals : [vals]).map((x) => (x === '' ? '""' : x)).join('\\|')}`)
        .join(' ');
      return `| \`${slot}\` | \`${v.tag}\` | ${attrs ? '`' + attrs + '`' : '—'} |`;
    });
  return rows.length ? ['| slot (`data-slot`) | element | observed attributes |', '|---|---|---|', ...rows].join('\n') : null;
}

const bullets = (a) => (a?.length ? a.map((x) => `- ${x}`).join('\n') : '- none recorded');

function spec(c, d) {
  const ev = evidence(c);
  const keys = codeKeys(c);
  const kb = d.keyboard?.length
    ? ['| Keys | Result |', '|---|---|', ...d.keyboard.map(([k, r]) => `| ${k} | ${r} |`)].join('\n')
    : 'No keyboard interaction beyond native browser behavior.';
  return `# ${d.title} — behavior spec

Evidence: ${ev ? '**[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/' + c + '.json`: slots, tags, ARIA/data attributes, class strings)' : '**[SOURCE]** no per-slot capture was kept for this component'}. ${d.evidenceNote ?? ''}
Not done: ${d.notDone ?? 'live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).'}

## Summary
${d.summary}

## Structure ${ev ? '[REA-DOM]' : ''}
${ev ?? d.structure ?? '_See the README parts table._'}
${ev && d.structure ? '\n' + d.structure : ''}

## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

${bullets(d.behavior)}

## Keyboard
${kb}

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): ${keys.length ? keys.map((k) => '`' + k + '`').join(', ') : 'none'}.

## Deviations
${bullets(d.deviations ?? [])}

## Angular notes
${d.angular ?? 'Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.'}

## UNKNOWN
${bullets(d.unknown ?? ['Screen-reader output on the original.', 'RTL and dark-mode pixel comparison.'])}
`;
}

function tests(c, d) {
  const sec = (name, items) =>
    items?.length
      ? `## ${name}\n${items.map(([a, e]) => `- [ ] ${a}\n  Expected: ${e}\n  Result:`).join('\n')}\n`
      : '';
  const t = d.tests ?? {};
  return `# ${d.title} — manual test checklist
Playground: Components → ${d.title}. Run each step and write what you observed under "Result:".

${sec('Visual', t.Visual)}${sec('Interaction', t.Interaction)}${sec('Keyboard', t.Keyboard)}${sec('Focus', t.Focus)}${sec('Forms', t.Forms)}${sec('Screen reader', t['Screen reader'] ?? [['Focus / operate the component with a screen reader.', d.sr ?? 'Role, name and state are announced as described in the spec.']])}${sec('Dark mode / RTL', [
    ['Toggle Dark in the header.', d.dark ?? 'Colors switch to the `.dark` tokens; no unreadable text, borders still visible.'],
    ['Toggle RTL in the header.', d.rtl ?? 'Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.'],
  ])}`;
}

function readme(c, d) {
  const sel = parts(c);
  const cn = constName(c);
  return `# ${d.title}

\`\`\`ts
import { ${cn ?? 'Ui' + d.title.replace(/\s/g, '')} } from '@loomui/ui/${c}';
// add to the component \`imports\` array
\`\`\`

\`\`\`html
${d.usage}
\`\`\`
${(() => {
    const el = toElements(d.usage);
    return el !== d.usage ? '\nSame thing as custom elements (identical inputs; directives keep working):\n\n```html\n' + el + '\n```\n' : '';
  })()}
${apiTable(d.api ?? autoApi(c))}
Parts (selectors): ${sel.length ? sel.map((s) => '`' + s + '`').join(', ') : '_class constants only; see the source_'}.

${d.readmeNote ?? ''}Spec: \`docs/behavior-specs/${c}.md\` · Manual test: \`docs/manual-tests/${c}.md\`
`;
}

const write = (rel, text) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
};

let n = 0;
for (const [c, d] of Object.entries(DOCS)) {
  if (only.length && !only.includes(c)) continue;
  if (!fs.existsSync(path.join(root, 'libs/ui', c))) {
    console.warn('skip (no lib folder):', c);
    continue;
  }
  write(`docs/behavior-specs/${c}.md`, spec(c, d));
  write(`docs/manual-tests/${c}.md`, tests(c, d));
  write(`libs/ui/${c}/README.md`, readme(c, d));
  n++;
}
console.log('generated docs for', n, 'components');
