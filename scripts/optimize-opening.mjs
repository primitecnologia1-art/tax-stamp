// Re-encode the mobile opening directly from the original photography.
// Preserve its approved crop and WebP fallback; AVIF gets a denser encoding.
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = path.join(root, 'public/media/optimized/manifest.json');
const assets = JSON.parse(await readFile(manifest, 'utf8'));
const original = await readFile(path.join(root, 'public/media/originals/leaf.png'));
const meta = await sharp(original).metadata();
const width = Math.round(meta.height * 9 / 16);
const crop = { width, height: meta.height, left: Math.round((meta.width - width) * .61), top: 0 };
const hash = createHash('sha256').update(original).update('hero-mobile-q48-effort6-v1').digest('hex').slice(0, 12);
const hero = assets.photos.leaf.heroMobile;
for (const variant of hero.variants) {
  const name = `leaf-hero-web-${hash}-${variant.width}.avif`;
  const output = path.join(root, 'public/media/optimized', name);
  if (!await stat(output).then(() => true, () => false)) await sharp(original).extract(crop).resize({ width: variant.width }).avif({ quality: 48, effort: 6 }).toFile(output);
  variant.avif = '/media/optimized/' + name;
  console.log(variant.width, (await stat(output)).size);
}
hero.avifSrcSet = hero.variants.map(v => `${v.avif} ${v.width}w`).join(', ');
await writeFile(manifest, JSON.stringify(assets, null, 2) + '\n');
await writeFile(path.join(root, 'src/media-data.js'), '/* Generated from the original reference files. */\nconst LT_ASSETS = ' + JSON.stringify(assets) + ';\n');
