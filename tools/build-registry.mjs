// Builds the copy-in registry consumed by the `Loom UI` CLI (packages/loomui-cli).
//   node tools/build-registry.mjs
// Output: packages/loomui-cli/registry/index.json + <component>.json (+ theme.json)
// Each item: { name, files: [{ path, content }], registryDependencies: [...], dependencies: { pkg: versionRange }, description }
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const lib = path.join(root, 'libs/ui');
const out = path.join(root, 'packages/loomui-cli/registry');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const versions = { ...pkg.dependencies, ...pkg.devDependencies };

const SKIP_DIR = new Set(['styles']);
const SKIP_FILE = /^(README\.md|ng-package\.json)$/;

// blurbs come from the showcase metadata
const meta = fs.readFileSync(path.join(root, 'projects/playground/src/app/components.data.ts'), 'utf8');
const blurbs = Object.fromEntries([...meta.matchAll(/^\s+'?([\w-]+)'?: \['[^']+', '([^']+)'\],?$/gm)].map((m) => [m[1], m[2]]));

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const index = [];
for (const name of fs.readdirSync(lib).sort()) {
  const dir = path.join(lib, name);
  if (!fs.statSync(dir).isDirectory() || SKIP_DIR.has(name)) continue;
  const files = fs
    .readdirSync(dir)
    .filter((f) => !SKIP_FILE.test(f) && fs.statSync(path.join(dir, f)).isFile())
    .map((f) => ({ path: f, content: fs.readFileSync(path.join(dir, f), 'utf8') }));
  const reg = new Set();
  const deps = {};
  for (const f of files) {
    if (!f.path.endsWith('.ts')) continue;
    for (const m of f.content.matchAll(/from\s+'([^']+)'/g)) {
      const spec = m[1];
      if (spec.startsWith('.')) continue;
      if (spec.startsWith('@loomui-ng/ui/')) {
        const dep = spec.slice('@loomui-ng/ui/'.length).split('/')[0];
        if (dep !== name) reg.add(dep);
        continue;
      }
      const base = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (base === '@angular/core' || base === '@angular/common' || base === 'rxjs' || base === 'tslib') {
        deps[base] = versions[base] ?? 'latest';
      } else deps[base] = versions[base] ?? 'latest';
    }
  }
  if (name === 'data-table') deps['@tanstack/angular-table'] = versions['@tanstack/angular-table'];
  const item = {
    name,
    description: blurbs[name] ?? '',
    files,
    registryDependencies: [...reg].sort(),
    dependencies: Object.fromEntries(Object.entries(deps).sort()),
  };
  fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(item));
  index.push({ name, description: item.description, registryDependencies: item.registryDependencies, dependencies: item.dependencies, files: files.map((f) => f.path) });
}

// Theme (tokens, variants, toast css) — built by tools/build-theme-css.mjs
const theme = fs.readFileSync(path.join(lib, 'styles/loomui.css'), 'utf8');
fs.writeFileSync(path.join(out, 'theme.json'), JSON.stringify({ name: 'theme', files: [{ path: 'loomui.css', content: theme }], dependencies: { 'tw-animate-css': versions['tw-animate-css'], '@angular/cdk': versions['@angular/cdk'], tailwindcss: versions['tailwindcss'] ?? '^4.0.0' } }));
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify({ version: '0.1.3', components: index }, null, 2));
console.log('registry:', index.length, 'items →', path.relative(root, out));
