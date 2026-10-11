// Generates the Loom UI logo assets from one 1024-unit design: a 3 × 3 plain weave (white warp, pale-indigo weft) on an
// indigo → cyan squircle with soft contact shadows where a thread passes over another.
//   node tools/gen-logo.mjs
// Output: projects/playground/public/{icon,logo-mark,favicon,logo-mark-mono,logo,logo-dark}.svg and docs/brand/ copies.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

// ---- geometry (1024 grid) ----
const W = 80; // thread thickness
const STEP = 152; // thread pitch
const START = 320; // first thread position
const POS = [0, 1, 2].map((i) => START + i * STEP);
const LO = 256; // threads run from 256 …
const HI = 768; // … to 768
const LEN = HI - LO;
const OVERLAP = 36; // how far a "top" piece reaches into the gap beside the crossing

const WARP = '#FFFFFF';
const WEFT = '#BFD0FF';

/** Inner SVG for the full-color mark. `id` namespaces gradients/filters so several marks can share a page. */
function mark(id, { shadows = true, highlight = true, square = false, weaveScale = 1 } = {}) {
  let s = `<defs>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse"><stop stop-color="#6366F1"/><stop offset="1" stop-color="#22D3EE"/></linearGradient>
    <radialGradient id="${id}-h" cx="0.28" cy="0.2" r="0.85"><stop stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <filter id="${id}-s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#312E81" flood-opacity=".32"/></filter>`;
  {
    // pieces and shadows are clipped to the thread they fall on, so they never smudge the thread's own continuation
    for (let i = 0; i < 3; i++) {
      s += `<clipPath id="${id}-r${i}"><rect x="${LO}" y="${POS[i]}" width="${LEN}" height="${W}" rx="40"/></clipPath>`;
      s += `<clipPath id="${id}-c${i}"><rect x="${POS[i]}" y="${LO}" width="${W}" height="${LEN}" rx="40"/></clipPath>`;
    }
  }
  s += `</defs><rect width="1024" height="1024" rx="${square ? 0 : 220}" fill="url(#${id}-g)"/>`;
  if (highlight) s += `<rect width="1024" height="1024" rx="${square ? 0 : 220}" fill="url(#${id}-h)"/>`;
  if (weaveScale !== 1) s += `<g transform="translate(512 512) scale(${weaveScale}) translate(-512 -512)">`;
  // threads underneath
  for (const y of POS) s += `<rect x="${LO}" y="${y}" width="${LEN}" height="${W}" rx="40" fill="${WEFT}"/>`;
  for (const x of POS) s += `<rect x="${x}" y="${LO}" width="${W}" height="${LEN}" rx="40" fill="${WARP}"/>`;
  // the thread that passes over at each crossing (plain weave: warp on top where column + row is even)
  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 3; r++) {
      const x = POS[c];
      const y = POS[r];
      const warpTop = (c + r) % 2 === 0;
      const piece = warpTop
        ? { x, y: y - OVERLAP, w: W, h: W + 2 * OVERLAP, fill: WARP, clip: `${id}-r${r}` }
        : { x: x - OVERLAP, y, w: W + 2 * OVERLAP, h: W, fill: WEFT, clip: `${id}-c${c}` };
      if (shadows) s += `<g clip-path="url(#${piece.clip})"><rect x="${piece.x}" y="${piece.y}" width="${piece.w}" height="${piece.h}" fill="${piece.fill}" filter="url(#${id}-s)"/></g>`;
      // clipped to its own rounded thread, so the piece never pokes past a thread's rounded end
      s += `<rect x="${piece.x}" y="${piece.y}" width="${piece.w}" height="${piece.h}" fill="${piece.fill}" clip-path="url(#${warpTop ? `${id}-c${c}` : `${id}-r${r}`})"/>`;
    }
  }
  if (weaveScale !== 1) s += `</g>`;
  return s;
}

/** Favicon: same weave, bigger threads and no effects so it stays crisp at 16 px. */
function favicon() {
  const w = 176;
  const g = 28;
  const start = (1024 - (3 * w + 2 * g)) / 2;
  const pos = [0, 1, 2].map((i) => start + i * (w + g));
  const lo = start - 48;
  const len = 3 * w + 2 * g + 96;
  const e = 24;
  let s = `<defs><linearGradient id="f-g" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse"><stop stop-color="#6366F1"/><stop offset="1" stop-color="#22D3EE"/></linearGradient>`;
  for (let i = 0; i < 3; i++) {
    s += `<clipPath id="f-r${i}"><rect x="${lo}" y="${pos[i]}" width="${len}" height="${w}" rx="${w / 2}"/></clipPath>`;
    s += `<clipPath id="f-c${i}"><rect x="${pos[i]}" y="${lo}" width="${w}" height="${len}" rx="${w / 2}"/></clipPath>`;
  }
  s += `</defs><rect width="1024" height="1024" rx="220" fill="url(#f-g)"/>`;
  for (const y of pos) s += `<rect x="${lo}" y="${y}" width="${len}" height="${w}" rx="${w / 2}" fill="#C7D6FF"/>`;
  for (const x of pos) s += `<rect x="${x}" y="${lo}" width="${w}" height="${len}" rx="${w / 2}" fill="#fff"/>`;
  for (let c = 0; c < 3; c++)
    for (let r = 0; r < 3; r++) {
      const x = pos[c];
      const y = pos[r];
      s += (c + r) % 2 === 0
        ? `<rect x="${x}" y="${y - e}" width="${w}" height="${w + 2 * e}" fill="#fff" clip-path="url(#f-c${c})"/>`
        : `<rect x="${x - e}" y="${y}" width="${w + 2 * e}" height="${w}" fill="#C7D6FF" clip-path="url(#f-r${r})"/>`;
    }
  return s;
}

/** One-color mark: tile in currentColor, threads white, gaps in the tile color (halo drawn unclipped, fill clipped). */
function mono() {
  let s = `<defs>`;
  for (let i = 0; i < 3; i++) {
    s += `<clipPath id="m-r${i}"><rect x="${LO}" y="${POS[i]}" width="${LEN}" height="${W}" rx="40"/></clipPath>`;
    s += `<clipPath id="m-c${i}"><rect x="${POS[i]}" y="${LO}" width="${W}" height="${LEN}" rx="40"/></clipPath>`;
  }
  s += `</defs><rect width="1024" height="1024" rx="220" fill="currentColor"/>`;
  for (const y of POS) s += `<rect x="${LO}" y="${y}" width="${LEN}" height="${W}" rx="40" fill="#fff"/>`;
  for (const x of POS) s += `<rect x="${x}" y="${LO}" width="${W}" height="${LEN}" rx="40" fill="#fff"/>`;
  for (let c = 0; c < 3; c++)
    for (let r = 0; r < 3; r++) {
      const x = POS[c];
      const y = POS[r];
      const warpTop = (c + r) % 2 === 0;
      const p = warpTop ? { x, y: y - OVERLAP, w: W, h: W + 2 * OVERLAP } : { x: x - OVERLAP, y, w: W + 2 * OVERLAP, h: W };
      s += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="none" stroke="currentColor" stroke-width="28"/>`;
      s += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="#fff" clip-path="url(#${warpTop ? 'm-c' + c : 'm-r' + r})"/>`;
    }
  return s;
}

const svg = (inner, vb, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none"${extra}>${inner}</svg>\n`;
const A11Y = ' role="img" aria-label="Loom UI"';
const FONT = `font-family="Inter, ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif"`;

const lockup = (text, id) =>
  svg(
    `<svg x="0" y="0" width="64" height="64" viewBox="0 0 1024 1024">${mark(id)}</svg><text x="78" y="43" ${FONT} font-size="32" font-weight="700" letter-spacing="-0.8" fill="${text}">Loom <tspan fill-opacity=".62" font-weight="600">UI</tspan></text>`,
    '0 0 222 64',
    A11Y,
  );

const markSvg = svg(mark('loom'), '0 0 1024 1024', ` width="1024" height="1024"${A11Y}`);
const files = {
  'icon.svg': markSvg,
  'logo-mark.svg': markSvg,
  'favicon.svg': svg(favicon(), '0 0 1024 1024'),
  'logo-mark-mono.svg': svg(mono(), '0 0 1024 1024', `${A11Y} color="#111827"`),
  'logo.svg': lockup('#0F172A', 'lg'),
  'logo-dark.svg': lockup('#F8FAFC', 'ld'),
};

for (const dir of ['projects/playground/public', 'docs/brand']) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(root, dir, name), content);
}
// Square (full-bleed) variants for platforms that apply their own mask: Apple touch icon, maskable PWA icon.
const square = svg(mark('sq', { square: true, weaveScale: 1.1 }), '0 0 1024 1024', ` width="1024" height="1024"${A11Y}`);
fs.writeFileSync(path.join(root, 'docs/brand/icon-square.svg'), square);
console.log('wrote', Object.keys(files).join(', '));
