// Update reference artwork without touching photography, film or page design.
// Usage: node scripts/refresh-reference-assets.mjs [path-to-sharp]
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'public/media/optimized/manifest.json');
const assets = JSON.parse(await readFile(manifestPath, 'utf8'));
const layerDataPath = path.join(root, 'src/layers-data.js');
const layerData = await readFile(layerDataPath, 'utf8');
const previousLayers = {
  circle: JSON.parse(layerData.match(/const LT_LAYER_IMAGES = (.*);/)[1]),
  rectangle: JSON.parse(layerData.match(/const LT_RECTANGLE_LAYER_IMAGES = (.*);/)[1]),
};
const changed = [];
const exists = file => stat(file).then(() => true, () => false);
const detailFiles = {
  circle: ['HOLOGRAFIA.png', 'CALCOGRAFIA TALHO DOCE.png', 'IRIS DE MAQUINA.png', 'MICROTEXTO PERSONALIZADO.png', 'IMPRESSAO IRIDESCENTE OPTICAMENTE VARIAVEL.png', 'desmetalização-novo.png', 'NUMERACAO MICRO PERFURADA.png', null, 'QR CODE.png'],
  rectangle: ['HOLOGRAFIA.png', 'IMPRESSAO CALCOGRAFICA TALHO DOCE.png', 'IRIS DE MAQUINA.png', 'MICROTEXTO PERSONALIZADO.png', 'IMPRESSAO IRIDESCENTE.png', 'DESMETALIZAÇÃO SOBE TARJA HOLOGRAFICA COM NANO NUMERAÇÃO.png', 'NUMERACAO MICRO PERFURADA.png', null, 'QR CODE.png'],
};
const layerFiles = {
  circle: ['1CAMADA.png', '2CAMADA.png', '3CAMADA.png', '4CAMADA.png', '5CAMADA.png', '6CAMADAPERFURACAO.png', '7CAMADARASTREABILIDADE.png', '8CAMADAINVISIVEL.png'],
  rectangle: Array.from({ length: 8 }, (_, index) => `${index + 1}CAMADA.png`),
};

// Validate both registered stacks before generating any replacements.
const stacks = {};
for (const format of ['circle', 'rectangle']) {
  stacks[format] = [];
  const directory = format === 'circle' ? 'EXPLOSION' : 'EXPLOSION-RECTANGLE';
  let canvas;
  for (const file of layerFiles[format]) {
    const input = await readFile(path.join(root, 'references', directory, file));
    const metadata = await sharp(input).metadata();
    canvas ??= { width: metadata.width, height: metadata.height };
    if (metadata.width !== canvas.width || metadata.height !== canvas.height) throw new Error(`Registered layer dimensions do not match: ${directory}/${file}`);
    stacks[format].push({ file, input, ...canvas });
  }
}

async function encode(source, name, candidates, quality, previous) {
  const input = await readFile(path.join(root, source));
  const metadata = await sharp(input).metadata();
  const widths = [...new Set(candidates.map(width => Math.min(width, metadata.width)))];
  const hash = createHash('sha256').update(input).update(JSON.stringify({ pipeline: 1, widths, quality })).digest('hex').slice(0, 12);
  const variants = [];
  for (const width of widths) {
    const filename = `${name}-${hash}-${width}.webp`;
    const output = path.join(root, 'public/media/optimized', filename);
    if (!await exists(output)) await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, alphaQuality: 100, effort: 5, smartSubsample: true }).toFile(output);
    variants.push({ width, webp: '/media/optimized/' + filename });
  }
  const asset = { width: metadata.width, height: metadata.height, variants, src: variants.at(-1).webp, srcSet: variants.map(v => `${v.webp} ${v.width}w`).join(', '), avifSrcSet: '' };
  if (previous?.src !== asset.src) changed.push(source);
  return asset;
}

for (const format of ['circle', 'rectangle']) {
  for (const uv of [false, true]) {
    const key = format + (uv ? '-uv' : '');
    const source = `references/BP_TAX_STAMP-${format.toUpperCase()}${uv ? '-UV' : ''}.png`;
    assets.seals[key] = await encode(source, 'seal-' + key, format === 'circle' ? [480, 800, 1200, 1600] : [800, 1200, 1600, 2400], 90, assets.seals[key]);
  }
  for (const [index, filename] of detailFiles[format].entries()) {
    if (!filename) {
      assets.details[format][index] = { ...assets.seals[format + (index === 7 ? '-uv' : '')], source: 'original-stamp' };
      continue;
    }
    const source = `references/ITENS DE SEGURANÇA - ${format.toUpperCase()}/${filename}`;
    assets.details[format][index] = { ...await encode(source, `detail-${format}-${index}`, [320, 960, 1600], 92, assets.details[format][index]), source };
  }
}

// The paper detail is shared by the circular and rectangular stamps.
const substrateSource = 'references/ITENS DE SEGURANÇA - CIRCLE/substrato-de-seguranca.png';
const substrate = { ...await encode(substrateSource, 'detail-substrate', [320, 960, 1600], 92, assets.details.circle[9]), source: substrateSource };
assets.details.circle[9] = substrate;
assets.details.rectangle[9] = substrate;

const layerImages = {};
for (const format of ['circle', 'rectangle']) {
  const directory = format === 'circle' ? 'layers-registered' : 'layers-rectangle';
  const outputDirectory = path.join(root, 'public/media', directory);
  await mkdir(outputDirectory, { recursive: true });
  layerImages[format] = [];
  for (const [index, layer] of stacks[format].entries()) {
    const key = format === 'circle' ? `registered-v4-${layer.width}-whole-canvas` : 'rectangle-v1-whole-canvas';
    const hash = createHash('sha256').update(key).update(layer.input).digest('hex').slice(0, 12);
    const filename = layer.file.replace(/\.png$/i, `-${hash}.webp`);
    const output = path.join(outputDirectory, filename);
    // The whole registered canvas is encoded: no crop, resize or reposition.
    if (!await exists(output)) await sharp(layer.input).webp({ quality: 92, alphaQuality: 100, effort: 5 }).toFile(output);
    const asset = { src: `/media/${directory}/${filename}`, width: layer.width, height: layer.height };
    if (previousLayers[format][index]?.src !== asset.src) changed.push(`references/${format === 'circle' ? 'EXPLOSION' : 'EXPLOSION-RECTANGLE'}/${layer.file}`);
    layerImages[format].push(asset);
  }
}

await writeFile(manifestPath, JSON.stringify(assets, null, 2) + '\n');
await writeFile(path.join(root, 'src/media-data.js'), '/* Generated from the original reference files. */\nconst LT_ASSETS = ' + JSON.stringify(assets) + ';\n');
await writeFile(layerDataPath, '/* Generated from the registered original canvases. */\nconst LT_LAYER_IMAGES = ' + JSON.stringify(layerImages.circle) + ';\nconst LT_RECTANGLE_LAYER_IMAGES = ' + JSON.stringify(layerImages.rectangle) + ';\n');
console.log(JSON.stringify({ updatedReferences: changed, totalUpdated: changed.length, checked: '4 seals, 16 per-format details and one shared substrate image, 16 explosion layers; both UV detail fallbacks synchronized' }, null, 2));
