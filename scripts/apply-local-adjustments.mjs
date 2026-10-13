import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToString } from 'react-dom/server';
import { prepareStyles } from './prepare-styles.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundlePath = path.join(
  projectRoot,
  "public",
  "_next",
  "static",
  "chunks",
  "Experience-CUGgApuT.js",
);
const htmlPath = path.join(projectRoot, "index.html");

let bundle = await readFile(bundlePath, "utf8");

// The UV selector controls the same live panel for both stamp formats.
const uvStart = bundle.indexOf('function ih(');
const uvEnd = bundle.indexOf('function ', uvStart + 12);
if (uvStart >= 0 && uvEnd > uvStart) {
  const uvSource = bundle.slice(uvStart, uvEnd)
    .replaceAll('(nh,{value:`circle`,children:', '(nh,{value:`circle`,"aria-controls":`uv-format-panel`,children:')
    .replaceAll('(nh,{value:`rectangle`,children:', '(nh,{value:`rectangle`,"aria-controls":`uv-format-panel`,children:')
    .replace('className:`light-stage`,children:', 'className:`light-stage`,id:`uv-format-panel`,role:`tabpanel`,"aria-label":n===`circle`?t.circular:t.rectangular,children:');
  bundle = bundle.slice(0, uvStart) + uvSource + bundle.slice(uvEnd);
}

// Keep editable component sources independent from the archived runtime.
async function injectComponent(label, file, startToken, endToken) {
  const source = await readFile(path.join(projectRoot, 'src', file), 'utf8');
  const markerStart = `/* LT_${label}_START */`;
  const markerEnd = `/* LT_${label}_END */`;
  let start = bundle.indexOf(markerStart);
  let end;
  if (start >= 0) {
    end = bundle.indexOf(markerEnd, start) + markerEnd.length;
    while (end < bundle.length && /[\r\n]/.test(bundle[end])) end++;
  } else {
    start = bundle.indexOf(startToken);
    end = bundle.indexOf(endToken, start);
  }
  if (start < 0 || end <= start) throw new Error(`Component boundary not found: ${label}`);
  bundle = bundle.slice(0, start) + markerStart + '\n' + source.trim() + '\n' + markerEnd + '\n' + bundle.slice(end);
  return source;
}

const layersSource = await injectComponent('LAYERS', 'layers.js', 'function Qm(', 'function $m(');
const securitySource = await injectComponent('SECURITY', 'security.js', 'function ah(', 'Si.registerPlugin(Y);var oh=');
await injectComponent('FILM', 'film.js', 'function Xm(', 'Si.registerPlugin(Y);var Zm=');
const sealSource = await injectComponent('SEAL', 'seal.js', 'function rh(', 'function ih(');
const brandSource = await injectComponent('BRAND', 'brand.js', 'function sh(', 'function ch(');

async function injectSupport(label, file) {
  const source = await readFile(path.join(projectRoot, 'src', file), 'utf8');
  const startMarker = `/* LT_${label}_START */`;
  const endMarker = `/* LT_${label}_END */`;
  const previous = bundle.indexOf(startMarker);
  if (previous >= 0) {
    const end = bundle.indexOf(endMarker, previous);
    if (end < 0) throw new Error('Missing support boundary: ' + label);
    let after = end + endMarker.length;
    while (after < bundle.length && /[\r\n]/.test(bundle[after])) after++;
    bundle = bundle.slice(0, previous) + bundle.slice(after);
  }
  const position = bundle.indexOf('function lh(');
  if (position < 0) throw new Error('Missing application boundary');
  bundle = bundle.slice(0, position) + startMarker + '\n' + source.trim() + '\n' + endMarker + '\n' + bundle.slice(position);
  return source;
}
const mediaDataSource = await injectSupport('MEDIA_DATA', 'media-data.js');
const layerDataSource = await injectSupport('LAYER_DATA', 'layers-data.js');
const mediaSource = await injectSupport('MEDIA', 'media.js');
const originSource = await injectSupport('ORIGIN', 'origin.js');
const siteCopySource = await injectSupport('SITE_COPY', 'site-copy.js');
await injectSupport('MOTION', 'motion.js');
const application = bundle.indexOf('function lh(');
const oldOriginClass = bundle.indexOf('className:`origin-scene`', application);
const oldOrigin = oldOriginClass >= 0 ? Math.max(
  bundle.lastIndexOf('(0,X.jsxs)(`section`,{', oldOriginClass),
  bundle.lastIndexOf('(0,X.jsx)(`section`,{', oldOriginClass)
) : -1;
if (oldOrigin >= application) {
  const next = bundle.indexOf('(0,X.jsx)(Qm,{lang:e})', oldOrigin);
  if (next < 0) throw new Error('Missing origin component boundary');
  bundle = bundle.slice(0, oldOrigin) + '(0,X.jsx)(LTOrigin,{lang:e}),' + bundle.slice(next);
} else if (!bundle.slice(application).includes('(0,X.jsx)(LTOrigin,{lang:e})')) throw new Error('Missing origin JSX boundary');
const mainStart = '(0,X.jsxs)(`main`,{ref:d,children:[';
const mainIndex = bundle.indexOf(mainStart, application);
if (mainIndex < 0) throw new Error('Missing main component boundary');
const heroCall = '(0,X.jsx)(LTHero,{lang:e,onFilm:()=>r(!0)}),';
if (!bundle.slice(mainIndex).includes('(0,X.jsx)(LTHero,')) {
  const first = mainIndex + mainStart.length;
  const originCall = bundle.indexOf('(0,X.jsx)(LTOrigin,{lang:e})', first);
  if (originCall < 0) throw new Error('Missing local origin call');
  bundle = bundle.slice(0, first) + heroCall + bundle.slice(originCall);
}
const oldMotion = bundle.indexOf('Si.fromTo(`.hero-media`,', bundle.indexOf('function lh('));
if (oldMotion >= 0) {
  const next = bundle.indexOf('},d),()=>e.revert()', oldMotion);
  if (next < 0) throw new Error('Missing motion boundary');
  bundle = bundle.slice(0, oldMotion) + 'LT_motion(e.conditions);' + bundle.slice(next);
}
bundle = bundle.replace('heroA:`O real deixa`,heroB:`um rastro`', 'heroA:`O que é real`,heroB:`deixa um rastro`');
bundle = bundle.replaceAll('children:`01:00`', 'children:LT_ASSETS.film.duration');
bundle = bundle
  .replaceAll('/media/us.svg', '/media/gb.svg')
  .replaceAll('English — EN-US', 'English — EN-GB')
  .replaceAll('title:`EN-US`', 'title:`EN-GB`')
  .replace('e===`pt`?`pt-BR`:`en-US`', 'e===`pt`?`pt-BR`:`en-GB`');
// Only the local React application is needed; no archived server/router bootstrap.
const applicationStart = bundle.indexOf('function lh(');
// User-requested policy: chapter animations are always scroll-driven, with no
// movement toggle and no device preference that silently removes the scenes.
bundle = bundle
  .replace('motion:`(prefers-reduced-motion: no-preference)`,desktop:`(min-width: 768px)`,reduced:`(prefers-reduced-motion: reduce)`', 'always:`all`,desktop:`(min-width: 768px)`')
  .replace('if(Y.create({trigger:d.current', 'Y.create({trigger:d.current')
  .replace(',e.conditions?.reduced)return;LT_motion(e.conditions);', ';LT_motion(e.conditions);')
  .replace(',!1)return;LT_motion(e.conditions);', ';LT_motion(e.conditions);');
if (!bundle.slice(applicationStart).includes('useEffect)(LTPrepareMedia')) {
  bundle = bundle.slice(0, applicationStart) + bundle.slice(applicationStart).replace('return(0,i.useEffect)', '(0,i.useEffect)(LTPrepareMedia,[]);return(0,i.useEffect)');
}
const closingStart = bundle.indexOf('className:`closing section-pad`');
const closingPictureStart = bundle.indexOf('(0,X.jsxs)(`picture`,', closingStart);
const closingPictureEnd = bundle.indexOf(',(0,X.jsx)(`div`,{className:`closing-shade`', closingPictureStart);
if (closingPictureStart >= 0 && closingPictureEnd > closingPictureStart) {
  bundle = bundle.slice(0, closingPictureStart) + '(0,X.jsx)(LTPhoto,{name:`dew`,framing:`closing`})' + bundle.slice(closingPictureEnd);
}
bundle = bundle.replace('(0,X.jsx)(LTPhoto,{name:`dew`})', '(0,X.jsx)(LTPhoto,{name:`dew`,framing:`closing`})');

// The linked company marks are already the full brand control; avoid nested links.
bundle = bundle.replace(
  '(0,X.jsx)(`a`,{href:`#inicio`,className:`brand-link`,"aria-label":e===`pt`?`PRIMI × BP Security — início`:`PRIMI × BP Security — home`,children:(0,X.jsx)(sh,{})})',
  '(0,X.jsx)(sh,{})',
);

// Closing copy is editable in src/site-copy.js.
bundle = bundle.replace(
  '(0,X.jsxs)(`h2`,{children:[m.ending,(0,X.jsx)(`br`,{}),(0,X.jsx)(`em`,{children:m.endingEm})]}),(0,X.jsx)(ch,{label:m.watch',
  '(0,X.jsxs)(`h2`,{children:[m.ending,(0,X.jsx)(`br`,{}),(0,X.jsx)(`em`,{children:m.endingEm})]}),(0,X.jsx)(`p`,{className:`closing-subtitle`,children:m.endingSubtitle}),(0,X.jsx)(ch,{label:m.watch',
);

// No technical-material download is part of this edition.
bundle = bundle.replace(
  '(0,X.jsxs)(`a`,{href:`/media/brochure-${e}.pdf`,target:`_blank`,rel:`noreferrer`,children:[m.brochure,` `,(0,X.jsx)(`span`,{children:`PDF`})]}),',
  '',
);

bundle = bundle.replace('`Rastro`', '`Rastreabilidade`').replace('`Trace`', '`Traceability`');
bundle = bundle
  .replace('(rh,{alt:`${m.sealImage} — ${m.circular}`})', '(rh,{sizes:`(max-width: 767px) 42vw, 340px`,alt:`${m.sealImage} — ${m.circular}`})')
  .replace('(rh,{format:`rectangle`,alt:`${m.sealImage} — ${m.rectangular}`})', '(rh,{format:`rectangle`,sizes:`(max-width: 767px) 76vw, 580px`,alt:`${m.sealImage} — ${m.rectangular}`})');
bundle = bundle.replace('nav:[`Origem`,`Camadas`,`Luz`,`Rastro`]', 'nav:[`Origem`,`Camadas`,`Luz`,`Rastreabilidade`]');

// Original photography replaces all decorative video frames and the hero loop.
for (const asset of ['leaf', 'dew', 'matter']) {
  bundle = bundle.replaceAll(`/media/${asset}.webp`, `/media/original-${asset}.webp`)
    .replaceAll(`/media/${asset}-mobile.webp`, `/media/original-${asset}-mobile.webp`);
}
bundle = bundle.replace('/media/${e}.webp', '/media/original-${e}.webp')
  .replace('/media/${e}-mobile.webp', '/media/original-${e}-mobile.webp');
bundle = bundle.replace('u(window.innerWidth>=768&&!e&&!n?.saveData)', 'u(!1)');

// Keep the header legible while the new white scenes pass underneath it.
bundle = bundle.replace('Y.create({trigger:`#rastro`,start:`top 75px`,end:`bottom 75px`,onToggle:e=>c(e.isActive)})',
  '[`#camadas`,`.security-atlas`,`#rastro`].forEach(e=>Y.create({trigger:e,start:`top 75px`,end:`bottom 75px`,onToggle:()=>c([`#camadas`,`.security-atlas`,`#rastro`].some(e=>{let t=document.querySelector(e)?.getBoundingClientRect();return t&&t.top<=75&&t.bottom>75}))}))');
bundle = bundle.replace(
  '[`#camadas`,`.security-atlas`,`#rastro`].forEach(e=>Y.create({trigger:e,start:`top 75px`,end:`bottom 75px`,onToggle:()=>c([`#camadas`,`.security-atlas`,`#rastro`].some(e=>{let t=document.querySelector(e)?.getBoundingClientRect();return t&&t.top<=75&&t.bottom>75}))}))',
  '[`#camadas`,`.security-atlas`,`#rastro`].forEach(e=>Y.create({trigger:e,start:()=>e===`#camadas`?`top -${window.innerHeight-75}`:`top 75px`,end:`bottom 75px`,onToggle:()=>c([`#camadas`,`.security-atlas`,`#rastro`].some(e=>{let t=document.querySelector(e)?.getBoundingClientRect(),n=e===`#camadas`?75-window.innerHeight:75;return t&&t.top<=n&&t.bottom>75}))}))'
);
bundle = bundle.replace('e===`#camadas`?`top -${window.innerHeight-75}`', 'e===`#camadas`?`top -${window.innerHeight-150}`')
  .replace('n=e===`#camadas`?75-window.innerHeight:75', 'n=e===`#camadas`?150-window.innerHeight:75');
// The shared optical reveal now reaches the header earlier in its shorter run.
bundle = bundle.replace('e===`#camadas`?`top -${window.innerHeight-150}`', 'e===`#camadas`?`top -${window.innerHeight*.25}`')
  .replace('n=e===`#camadas`?150-window.innerHeight:75', 'n=e===`#camadas`?-window.innerHeight*.25:75');

// Inverte a direção da explosão: a camada 01 passa para a base da pilha.
bundle = bundle
  .replace("(r-2.5)*(t?40:84)", "(2.5-r)*(t?40:84)")
  .replace("(r-2.5)*(t?4:11)", "(2.5-r)*(t?4:11)");

const lightFunctionStart = bundle.indexOf("function ih({lang:e})");
if (lightFunctionStart < 0) {
  throw new Error("Não foi possível localizar a experiência UV no bundle.");
}

// O modo pontual UV passa a ser o estado inicial.
const dayState = "[a,o]=(0,i.useState)(`day`)";
const spotState = "[a,o]=(0,i.useState)(`spot`)";
const stateIndex = bundle.indexOf(dayState, lightFunctionStart);
if (stateIndex >= 0) {
  bundle = bundle.slice(0, stateIndex) + spotState + bundle.slice(stateIndex + dayState.length);
}

// Remove os botões de alternância: a luz segue diretamente o cursor/toque.
const controlsStartToken = ",(0,X.jsxs)(`div`,{className:`light-controls`";
const controlsEndToken = "]}),(0,X.jsxs)(`div`,{className:`light-stage`";
const controlsStart = bundle.indexOf(controlsStartToken, lightFunctionStart);
const controlsEnd = bundle.indexOf(controlsEndToken, controlsStart);
if (controlsStart >= 0 && controlsEnd > controlsStart) {
  bundle = bundle.slice(0, controlsStart) + bundle.slice(controlsEnd);
}

// Narrative order: origin → formats → layers → security → UV → traceability.
const orderMain = bundle.indexOf(mainStart, bundle.indexOf('function lh('));
const layersCall = bundle.indexOf('(0,X.jsx)(Qm,{lang:e})', orderMain);
const formatsCall = bundle.indexOf('(0,X.jsx)(`section`,{className:`formats-scene`', orderMain);
const lightCall = bundle.indexOf('(0,X.jsx)(ih,{lang:e})', orderMain);
const securityCall = bundle.indexOf('(0,X.jsx)(ah,{lang:e})', orderMain);
const traceCall = bundle.indexOf('(0,X.jsxs)(`section`,{className:`trace-section', orderMain);
if (layersCall < formatsCall && formatsCall < lightCall && lightCall < securityCall && securityCall < traceCall) {
  const layersSegment = bundle.slice(layersCall, formatsCall);
  const formatsSegment = bundle.slice(formatsCall, lightCall);
  const lightSegment = bundle.slice(lightCall, securityCall);
  const securitySegment = bundle.slice(securityCall, traceCall);
  bundle = bundle.slice(0, layersCall) + formatsSegment + layersSegment + securitySegment + lightSegment + bundle.slice(traceCall);
}

await writeFile(bundlePath, bundle, "utf8");

let html = await readFile(htmlPath, "utf8");
// Hosting-specific challenge code is unrelated to this local/static deployment.
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, script => script.includes('/cdn-cgi/challenge-platform/') ? '' : script);
if (!html.includes('href="/local-overrides.css"')) {
  html = html.replace("</head>", '<link rel="stylesheet" href="/local-overrides.css"/></head>');
}

html = html
  .replace("light-lab section-pad light-day", "light-lab section-pad light-spot")
  .replace("light-window is-circle mode-day", "light-window is-circle mode-spot")
  .replace(/<div class="light-controls">.*?<\/div>/, "")
  .replace(
    /<div class="light-caption">.*?<\/div><\/div><\/section>/,
    '<div class="light-caption"><span>UV</span><p><span class="desktop-only">Mova a luz. Descubra o invisível.</span><span class="mobile-only">Toque no selo para mover a luz.</span></p><span class="light-state" aria-hidden="true">◉</span></div></div></section>',
  );

for (const asset of ['leaf', 'dew', 'matter']) {
  html = html.replaceAll(`/media/${asset}.webp`, `/media/original-${asset}.webp`)
    .replaceAll(`/media/${asset}-mobile.webp`, `/media/original-${asset}-mobile.webp`);
}
html = html.replace(/>Rastro</g, '>Rastreabilidade<').replace(/>04 Rastro</g, '>04 Rastreabilidade<');
html = html.replace(/<h1\b[^>]*id="hero-title"[\s\S]*?<\/h1>/,
  '<h1 id="hero-title" aria-label="O que é real deixa um rastro vivo."><span>O que é real</span><span>deixa um rastro<!-- --> <em>vivo.</em></span></h1>');
html = html
  .replaceAll('/media/us.svg', '/media/gb.svg')
  .replaceAll('English — EN-US', 'English — EN-GB')
  .replaceAll('title="EN-US"', 'title="EN-GB"')
  .replaceAll('Sob luz ultravioleta, uma outra identidade se revela. Explore a impressão invisível nos dois formatos do selo.', 'Sob luz ultravioleta, uma nova camada da identidade se revela. Explore os elementos invisíveis presentes nos dois formatos do selo.')
  .replaceAll('A impressão de segurança cria a prova física. A verificação digital conecta essa prova à identidade registrada do produto.', 'A impressão de segurança cria a prova física. A verificação digital conecta essa prova a uma identidade única e rastreável.')
  .replaceAll('Cada validação registra data, hora, localização, produto, número de série, imagem e resultado.', 'Cada validação gera um registro com data, hora, localização, produto, número de série, imagem e resultado.')
  .replaceAll('Acesso gratuito para consumidores e fiscais.', 'Acesso direto para consumidores, empresas e fiscalização.')
  .replaceAll('Prova física. Rastreabilidade digital.', 'Prova física. Verificação por IA. Rastreabilidade digital.')
  .replace(/<h2>O real deixa um<br\/><em>rastro vivo\.<\/em><\/h2>/, '<h2>Living Trace<br/><em>Tax Stamp</em></h2><p class="closing-subtitle">O que é autêntico deixa um rastro vivo.</p>')
  .replace(/<a href="\/media\/brochure-pt\.pdf"[\s\S]*?<\/a>/, '');

// Prerender these same sources so hydration sees the updated eight-layer atlas.
const qsStart = bundle.indexOf('var qs=') + 'var qs='.length;
const qsEnd = bundle.indexOf(',Js=', qsStart);
const ysStart = bundle.indexOf('Ys=[', qsEnd) + 'Ys='.length;
const ysEnd = bundle.indexOf(',Xs=', ysStart);
const element = React.createElement;
const renderDiv = props => element('div', props);
const renderTab = props => element('button', { ...props, type: 'button', role: 'tab', 'aria-selected': props.value === 'circle', 'data-slot': 'tabs-trigger', 'data-state': props.value === 'circle' ? 'active' : 'inactive' });
const sandbox = {
  i: React,
  X: jsxRuntime,
  $m: props => element('div', { ...props, 'data-slot': 'tabs', 'data-orientation': 'horizontal', dir: 'ltr' }),
  th: props => element('div', { ...props, role: 'tablist', 'data-slot': 'tabs-list' }),
  nh: renderTab,
};
vm.createContext(sandbox);
vm.runInContext(`const qs=${bundle.slice(qsStart, qsEnd)};const Ys=${bundle.slice(ysStart, ysEnd)};\n${siteCopySource}\n${mediaDataSource}\n${layerDataSource}\n${mediaSource}\n${sealSource}\n${brandSource}\n${layersSource}\n${securitySource}\n${originSource}`, sandbox);
// Match the archived runtime's React version, including text/array boundaries.
const layersHtml = renderToString(element(sandbox.Qm, { lang: 'pt' }));
const securityHtml = renderToString(element(sandbox.ah, { lang: 'pt' }));
const originHtml = renderToString(element(sandbox.LTOrigin, { lang: 'pt' }));
const heroHtml = renderToString(element(sandbox.LTHero, { lang: 'pt' }));
const brandHeaderHtml = renderToString(element(sandbox.sh));
const brandFooterHtml = renderToString(element(sandbox.sh, { footer: true }));
function sectionRange(startToken) {
  const start = startToken instanceof RegExp ? html.search(startToken) : html.indexOf(startToken);
  if (start < 0) throw new Error('HTML section start not found: ' + startToken);
  const tags = /<\/?section\b[^>]*>/g;
  tags.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tags.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return [start, tags.lastIndex];
  }
  throw new Error('HTML section end not found: ' + startToken);
}
function replaceSection(startToken, output) {
  const [start, end] = sectionRange(startToken);
  html = html.slice(0, start) + output + html.slice(end);
}
replaceSection('<section class="layers-scene', layersHtml);
replaceSection('<section class="hero"', heroHtml);
replaceSection(/<section\b[^>]*class="origin-scene/, originHtml);
replaceSection('<section class="security-explorer', securityHtml);
html = html
  .replace(/<div class="brand (?:brand-header)?" aria-label="PRIMI e BP Security">[\s\S]*?<\/div>/, brandHeaderHtml)
  .replace(/<div class="brand brand-footer" aria-label="PRIMI e BP Security">[\s\S]*?<\/div>/, brandFooterHtml);

// Match the server-rendered section order to the client runtime.
const orderedTokens = [
  '<section class="hero"',
  /<section\b[^>]*class="origin-scene/,
  '<section class="formats-scene',
  '<section class="layers-scene',
  '<section class="security-explorer',
  '<section class="light-lab',
  '<section class="trace-section',
  '<section class="closing section-pad',
];
const orderedSections = orderedTokens.map(token => {
  const [start, end] = sectionRange(token);
  return { start, end, markup: html.slice(start, end) };
});
const narrativeStart = Math.min(...orderedSections.map(section => section.start));
const narrativeEnd = Math.max(...orderedSections.map(section => section.end));
html = html.slice(0, narrativeStart) + orderedSections.map(section => section.markup).join('') + html.slice(narrativeEnd);

// Keep the same complete SSR markup, hydrating with the lean local entry point.
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, script =>
  script.includes('vinext.navigationRuntime') || script.includes('/_next/static/chunks/') || script.includes('/src/main.js') ? '' : script);
html = html.replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '');
if (!html.includes('<div id="app">')) {
  html = html.replace('<body>', '<body><div id="app">').replace('</body>', '</div></body>');
}
html = html.replace('</body>', '<script type="module" fetchpriority="low" src="/src/main.js"></script></body>');
html = html.replace(/<section class="closing section-pad"><picture>[\s\S]*?<\/picture>/,
  '<section class="closing section-pad">' + renderToString(element(sandbox.LTPhoto, { name: 'dew', framing: 'closing' })));
// The format showcase and UV lab share this responsive, complete asset manifest.
html = html.replace(/<img\b[^>]*src="\/media\/(?:optimized\/)?seal-(circle|rectangle)(-uv)?-[^" ]+"[^>]*>/g, (tag, format, uv) => {
  const alt = tag.match(/alt="([^"]*)"/)?.[1] ?? '';
  const className = tag.match(/class="([^"]*)"/)?.[1] ?? '';
  return renderToString(element(sandbox.rh, { format, uv: Boolean(uv), alt, className }));
});
html = html.replaceAll('>01:00<', '>01:02<');
const fonts = ['manrope-latin-wght-normal.DHIcAJRg.woff2', 'instrument-serif-latin-400-italic.DKMiL14s.woff2'];
for (const font of fonts) {
  if (!html.includes(`href="/_next/static/media/${font}"`)) {
    html = html.replace('</head>', `<link rel="preload" href="/_next/static/media/${font}" as="font" type="font/woff2" crossorigin/></head>`);
  }
}
const assets = JSON.parse(await readFile(path.join(projectRoot, 'public/media/optimized/manifest.json'), 'utf8'));
html = html.replace(/<link\b[^>]*data-lt-hero-preload[^>]*>/g, '');
const heroPreload = [
  { asset: assets.photos.leaf.heroMobile, media: '(max-width: 767px) and (max-aspect-ratio: 9/16)', sizes: 'max(100vw, 56.25svh)' },
  { asset: assets.photos.leaf.desktop, media: 'not all and (max-width: 767px) and (max-aspect-ratio: 9/16)', sizes: 'max(100vw, 177.78svh)' },
].map(({ asset, media, sizes }) => `<link data-lt-hero-preload rel="preload" as="image" type="image/avif" media="${media}" imagesrcset="${asset.avifSrcSet}" imagesizes="${sizes}" fetchpriority="high"/>`).join('');
html = html.replace('</title>', '</title>' + heroPreload);

const runtimeDirectory = path.join(projectRoot, 'src/generated/runtime');
await mkdir(runtimeDirectory, { recursive: true });
for (const name of ['Experience-CUGgApuT.js', 'framework-D_rUT4EX.js', 'rolldown-runtime-C60lm6uB.js']) {
  await copyFile(path.join(projectRoot, 'public/_next/static/chunks', name), path.join(runtimeDirectory, name));
}

// Render the complete application with its actual tab/dialog components.
// Partial stubs created hydration mismatches and rebuilt the page at startup.
const renderContext = {
  React, e: module => ({ ...module, default: module }),
  t: () => React, n: () => ReactDOM, r: () => jsxRuntime,
  Si: { registerPlugin() {} }, Y: {},
  window: { matchMedia: () => ({ matches: false }) }, navigator: {},
  console, setTimeout, clearTimeout,
};
vm.createContext(renderContext);
const renderSource = 'var i=React;' + bundle.slice(bundle.indexOf('var qs='))
  .replace(/export\{lh as default\};?\s*$/, 'this.App=lh;');
vm.runInContext(renderSource, renderContext);
const completeHtml = renderToString(element(renderContext.App))
  .replace(/<link\b[^>]*rel="preload"[^>]*>/g, '');
html = html.replace(/<body\b[^>]*>[\s\S]*<\/body>/,
  '<body><div id="app">' + completeHtml + '</div><script type="module" fetchpriority="low" src="/src/main.js"></script></body>');

// Deliver the complete, compact stylesheet in the initial response: no extra
// blocking CSS round trips and no flash of unstyled content on a slow connection.
html = html.replace(/<style id="lt-styles">[\s\S]*?<\/style>/g, '')
  .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, '');
const styles = await prepareStyles(projectRoot, bundle, html);
html = html.replace('</head>', `<style id="lt-styles">${styles}</style></head>`);
console.log(`Site stylesheet reduced and inlined: ${Math.round(styles.length / 1024)} KiB.`);

await writeFile(htmlPath, html, "utf8");
