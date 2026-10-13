// Keep the original logos untouched; generate crisp web-sized copies.
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = path.join(root, 'public/media/optimized/manifest.json');
const assets = JSON.parse(await readFile(manifest, 'utf8'));
assets.logos = {};
for (const [name, width] of [['primi', 320], ['bp', 384]]) {
  const input = await readFile(path.join(root, 'public/media', name + '-logo.webp'));
  const hash = createHash('sha256').update(input).update(`web-logo-v1-${width}`).digest('hex').slice(0, 12);
  const filename = `${name}-logo-${hash}.webp`;
  const output = path.join(root, 'public/media/optimized', filename);
  if (!await stat(output).then(() => true, () => false)) await sharp(input).resize({ width }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(output);
  assets.logos[name] = '/media/optimized/' + filename;
  console.log(name, (await stat(output)).size);
}
await writeFile(manifest, JSON.stringify(assets, null, 2) + '\n');
await writeFile(path.join(root, 'src/media-data.js'), '/* Generated from the original reference files. */\nconst LT_ASSETS = ' + JSON.stringify(assets) + ';\n');
