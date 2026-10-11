// Rasterises the Loom UI SVG logo set into every raster asset a web app needs: favicon.ico, PNG favicons, Apple touch icon,
// PWA icons (any + maskable), a social share image and the web manifest. Run after tools/gen-logo.mjs.
//   node tools/gen-icons.mjs
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(import.meta.dirname, '..');
const brand = path.join(root, 'docs/brand');
const pub = path.join(root, 'projects/playground/public');
const exportsDir = path.join(brand, 'exports');
fs.mkdirSync(exportsDir, { recursive: true });

const read = (f) => fs.readFileSync(path.join(brand, f), 'utf8');
const FONTS = { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' };

function png(svg, width, { background } = {}) {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: width }, background, font: FONTS });
  return r.render().asPng();
}
const write = (dir, name, data) => fs.writeFileSync(path.join(dir, name), data);

// ---- favicons (small sizes use the simplified favicon.svg) ----
const favicon = read('favicon.svg');
const f16 = png(favicon, 16);
const f32 = png(favicon, 32);
const f48 = png(favicon, 48);
write(pub, 'favicon-16x16.png', f16);
write(pub, 'favicon-32x32.png', f32);

/** ICO container embedding PNG images (supported by every browser since IE9). */
function ico(images) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([head, dir, ...images.map((i) => i.data)]);
}
write(pub, 'favicon.ico', ico([{ size: 16, data: f16 }, { size: 32, data: f32 }, { size: 48, data: f48 }]));

// ---- app icons ----
const icon = read('icon.svg');
const square = read('icon-square.svg');
write(pub, 'apple-touch-icon.png', png(square, 180)); // iOS applies its own rounded mask
write(pub, 'icon-192.png', png(icon, 192));
write(pub, 'icon-512.png', png(icon, 512));
write(pub, 'icon-maskable-512.png', png(square, 512)); // full bleed + weave inside the maskable safe zone

// ---- social share image (1200 × 630) ----
const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <defs>
    <linearGradient id="og-bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse"><stop stop-color="#0B1020"/><stop offset="1" stop-color="#111B3A"/></linearGradient>
    <radialGradient id="og-a" cx="0.15" cy="0.1" r="0.6"><stop stop-color="#6366F1" stop-opacity=".55"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>
    <radialGradient id="og-b" cx="0.95" cy="0.95" r="0.55"><stop stop-color="#22D3EE" stop-opacity=".4"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og-bg)"/>
  <rect width="1200" height="630" fill="url(#og-a)"/>
  <rect width="1200" height="630" fill="url(#og-b)"/>
  <svg x="96" y="175" width="280" height="280" viewBox="0 0 1024 1024">${inner(icon)}</svg>
  <text x="420" y="300" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="112" font-weight="700" letter-spacing="-3" fill="#F8FAFC">Loom UI</text>
  <text x="424" y="372" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="38" fill="#B6C0DC">Accessible Angular components,</text>
  <text x="424" y="422" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="38" fill="#B6C0DC">woven your way.</text>
  <g font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="24" fill="#E2E8F0">
    <rect x="424" y="470" width="190" height="48" rx="24" fill="#ffffff" fill-opacity=".1"/><text x="519" y="502" text-anchor="middle">Directives</text>
    <rect x="630" y="470" width="260" height="48" rx="24" fill="#ffffff" fill-opacity=".1"/><text x="760" y="502" text-anchor="middle">Custom elements</text>
    <rect x="906" y="470" width="190" height="48" rx="24" fill="#ffffff" fill-opacity=".1"/><text x="1001" y="502" text-anchor="middle">Lucide icons</text>
  </g>
</svg>`;
const ogPng = png(og, 1200);
write(pub, 'og-image.png', ogPng);

// ---- web manifest ----
write(
  pub,
  'site.webmanifest',
  JSON.stringify(
    {
      name: 'Loom UI',
      short_name: 'Loom UI',
      description: 'Accessible Angular components, woven your way. Directives and custom elements, built on the CDK and Tailwind.',
      start_url: '/',
      display: 'standalone',
      background_color: '#0B1020',
      theme_color: '#6366F1',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      ],
    },
    null,
    2,
  ) + '\n',
);

// ---- brand exports for design tools / stores ----
write(exportsDir, 'icon-1024.png', png(icon, 1024));
write(exportsDir, 'icon-512.png', png(icon, 512));
write(exportsDir, 'icon-256.png', png(icon, 256));
write(exportsDir, 'icon-square-1024.png', png(square, 1024));
write(exportsDir, 'favicon-16.png', f16);
write(exportsDir, 'favicon-32.png', f32);
write(exportsDir, 'favicon-48.png', f48);
write(exportsDir, 'logo-light-bg.png', png(read('logo.svg'), 1332)); // transparent background
write(exportsDir, 'logo-dark-bg.png', png(read('logo-dark.svg'), 1332));
write(exportsDir, 'og-image.png', ogPng);

console.log('icons written to', path.relative(root, pub), 'and', path.relative(root, exportsDir));
for (const f of fs.readdirSync(pub).filter((f) => /\.(png|ico|webmanifest)$/.test(f))) console.log(' ', f, fs.statSync(path.join(pub, f)).size, 'bytes');
