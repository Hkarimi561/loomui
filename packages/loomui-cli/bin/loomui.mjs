#!/usr/bin/env node
// Loom UI — copy-in CLI: add accessible Angular components to your project and own the code.
//   npx loomui init                 write loomui.json, copy the theme CSS + utils
//   npx loomui add button dialog    copy components (and their dependencies) into your project
//   npx loomui add --all
//   npx loomui list
// Options: --dir <path> (default src/app/ui)  --css <path> (default src/styles.css)  --overwrite  --install  --yes
//          --registry <dir|url>  (or env LOOMUI_REGISTRY)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    const key = a.slice(2);
    if (['dir', 'css', 'registry'].includes(key)) flags[key] = argv[++i];
    else flags[key] = true;
  } else positional.push(a);
}
const [command, ...names] = positional;
const cwd = process.cwd();
const CONFIG = 'loomui.json';

const c = (code, s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const ok = (s) => console.log(c(32, '✔'), s);
const info = (s) => console.log(c(36, '•'), s);
const warn = (s) => console.log(c(33, '!'), s);
const fail = (s) => {
  console.error(c(31, '✖'), s);
  process.exit(1);
};

// ---------- registry access (local folder or URL) ----------
const registry = flags.registry ?? process.env.LOOMUI_REGISTRY ?? path.join(here, '..', 'registry');
const isUrl = /^https?:\/\//.test(registry);
async function load(name) {
  if (isUrl) {
    const res = await fetch(`${registry.replace(/\/$/, '')}/${name}.json`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${name}`);
    return res.json();
  }
  const file = path.join(registry, `${name}.json`);
  if (!fs.existsSync(file)) throw new Error(`"${name}" not found in the registry (${registry})`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ---------- config ----------
function readConfig() {
  const p = path.join(cwd, CONFIG);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}
const toPosix = (p) => p.split(path.sep).join('/');

function writeFile(target, content, { overwrite }) {
  if (fs.existsSync(target) && !overwrite) {
    const same = fs.readFileSync(target, 'utf8') === content;
    return same ? 'same' : 'skipped';
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
  return 'written';
}

/** `@loomui/ui/<x>` → relative path from the file's folder to <uiDir>/<x>. */
function rewriteImports(content, fileDir, uiDir) {
  return content.replace(/from\s+'@loomui\/ui\/([\w-]+)'/g, (_, dep) => {
    let rel = toPosix(path.relative(fileDir, path.join(uiDir, dep)));
    if (!rel.startsWith('.')) rel = './' + rel;
    return `from '${rel}'`;
  });
}

function install(deps) {
  const list = Object.entries(deps).map(([p, v]) => `${p}@${v}`);
  if (!list.length) return;
  if (flags.install) {
    info(`npm install ${list.join(' ')}`);
    const r = spawnSync('npm', ['install', ...list], { stdio: 'inherit', shell: true, cwd });
    if (r.status !== 0) warn('npm install failed — run it manually.');
  } else {
    info('Install the npm dependencies:');
    console.log(`    npm install ${list.join(' ')}`);
  }
}

// ---------- commands ----------
async function init() {
  const cfg = { uiDir: flags.dir ?? 'src/app/ui', css: flags.css ?? 'src/styles.css' };
  fs.writeFileSync(path.join(cwd, CONFIG), JSON.stringify(cfg, null, 2) + '\n');
  ok(`wrote ${CONFIG}`);

  const theme = await load('theme');
  const cssDir = path.dirname(path.join(cwd, cfg.css));
  const themeFile = path.join(cssDir, 'loomui.css');
  let css = theme.files[0].content;
  // scan the copied components instead of the (absent) npm package
  let rel = toPosix(path.relative(cssDir, path.join(cwd, cfg.uiDir)));
  if (!rel.startsWith('.')) rel = './' + rel;
  css = css.replace('@source "../";', `@source "${rel}";`).replace(/\/\* Let Tailwind scan[^\n]*\n/, '/* Tailwind scans the copied components. */\n');
  css = css.replace(/\/\*![\s\S]*?\*\/\n/, '/* Loom UI theme (copied by `loomui init`): design tokens, custom variants, toast + accent presets. Yours to edit. */\n');
  const res = writeFile(themeFile, css, { overwrite: flags.overwrite });
  ok(`${res === 'written' ? 'wrote' : 'kept existing'} ${toPosix(path.relative(cwd, themeFile))}`);

  const cssPath = path.join(cwd, cfg.css);
  if (fs.existsSync(cssPath)) {
    const src = fs.readFileSync(cssPath, 'utf8');
    if (!src.includes('loomui.css')) {
      const line = `@import './loomui.css';`;
      const next = /@import\s+['"]tailwindcss['"];?/.test(src) ? src.replace(/(@import\s+['"]tailwindcss['"];?)/, `$1\n${line}`) : `${line}\n${src}`;
      fs.writeFileSync(cssPath, next);
      ok(`added ${line} to ${cfg.css}`);
    } else info(`${cfg.css} already imports loomui.css`);
  } else warn(`${cfg.css} not found — add  @import 'tailwindcss'; @import './loomui.css';  to your global stylesheet.`);

  await add(['utils'], cfg, { quiet: true });
  install(theme.dependencies);
  console.log('\nNext: ' + c(36, 'npx loomui add button') + '   (see `npx loomui list`)');
}

async function add(requested, cfgIn, opts = {}) {
  const cfg = cfgIn ?? readConfig();
  if (!cfg) fail(`No ${CONFIG} found. Run \`npx loomui init\` first.`);
  const uiDir = path.join(cwd, cfg.uiDir);

  let wanted = requested;
  if (flags.all) wanted = (await load('index')).components.map((x) => x.name).filter((n) => n !== 'utils');
  if (!wanted.length) fail('Usage: loomui add <component...>  (or --all). Try `loomui list`.');

  const seen = new Set();
  const order = [];
  const visit = async (name) => {
    if (seen.has(name)) return;
    seen.add(name);
    let item;
    try {
      item = await load(name);
    } catch (e) {
      fail(e.message);
    }
    for (const d of item.registryDependencies ?? []) await visit(d);
    order.push(item);
  };
  for (const n of wanted) await visit(n);

  const npmDeps = {};
  for (const item of order) {
    const dir = path.join(uiDir, item.name);
    const results = item.files.map((f) => {
      const content = f.path.endsWith('.ts') ? rewriteImports(f.content, dir, uiDir) : f.content;
      return writeFile(path.join(dir, f.path), content, { overwrite: flags.overwrite });
    });
    Object.assign(npmDeps, item.dependencies);
    if (!opts.quiet || item.name !== 'utils') {
      const w = results.filter((r) => r === 'written').length;
      const s = results.filter((r) => r === 'skipped').length;
      const tag = wanted.includes(item.name) ? '' : c(90, ' (dependency)');
      ok(`${item.name}${tag}: ${w} file(s) written${s ? `, ${s} skipped (exists — use --overwrite)` : ''}`);
    }
  }
  if (!opts.quiet) {
    const top = order.filter((i) => wanted.includes(i.name)).map((i) => i.name);
    info(`Import from  ${toPosix(path.join(cfg.uiDir, top[0] ?? ''))}  (each folder has an index.ts).`);
  }
  install(npmDeps);
}

async function list() {
  const idx = await load('index');
  const w = Math.max(...idx.components.map((x) => x.name.length));
  for (const x of idx.components) if (x.name !== 'utils') console.log(`  ${x.name.padEnd(w)}  ${c(90, x.description)}`);
  console.log(`\n${idx.components.length - 1} components`);
}

const help = () =>
  console.log(`Loom UI — copy accessible Angular components into your project

  loomui init [--dir src/app/ui] [--css src/styles.css]
  loomui add <component...> [--all] [--overwrite] [--install]
  loomui list

  --registry <dir|url>   use another registry (or env LOOMUI_REGISTRY)`);

try {
  if (command === 'init') await init();
  else if (command === 'add') await add(names);
  else if (command === 'list') await list();
  else help();
} catch (e) {
  fail(e.message);
}
