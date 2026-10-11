// Adds the custom-element form of the first ```html usage block to hand-written READMEs that do not have it yet.
//   node tools/readme-elements.mjs
import fs from 'node:fs';
import path from 'node:path';
import { toElements } from './to-elements.mjs';

const lib = path.resolve(import.meta.dirname, '../libs/ui');
let n = 0;
for (const c of fs.readdirSync(lib)) {
  const file = path.join(lib, c, 'README.md');
  if (!fs.existsSync(file)) continue;
  let md = fs.readFileSync(file, 'utf8');
  if (md.includes('custom elements')) continue;
  const m = md.match(/```html\n([\s\S]*?)```\n/);
  if (!m) continue;
  const el = toElements(m[1]);
  if (el === m[1]) continue;
  const block = '\nSame thing as custom elements (identical inputs; directives keep working):\n\n```html\n' + el + '```\n';
  md = md.replace(m[0], m[0] + block);
  fs.writeFileSync(file, md);
  n++;
}
console.log('READMEs updated:', n);
