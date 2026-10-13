// Re-encode the final master, not an already compressed web copy.
// Usage: node scripts/optimize-film.mjs [path-to-ffmpeg]
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'references/WHATSREAL-FINAL.mp4');
const master = await readFile(input);
const profiles = [
  { key: 'desktop', width: 1920, crf: '23', maxrate: '4000k', audio: '128k' },
  { key: 'mobile', width: 960, crf: '24', maxrate: '1400k', audio: '96k' },
];
const manifestPath = path.join(root, 'public/media/optimized/manifest.json');
const assets = JSON.parse(await readFile(manifestPath, 'utf8'));
for (const profile of profiles) {
  const hash = createHash('sha256').update(master).update(JSON.stringify(profile)).update('x264-slow-v1').digest('hex').slice(0, 12);
  const name = `film-web-${hash}-${profile.width}.mp4`;
  const output = path.join(root, 'public/media/optimized', name);
  if (!await stat(output).then(() => true, () => false)) {
    await new Promise((resolve, reject) => {
      const child = spawn(process.argv[2] || 'ffmpeg', ['-hide_banner', '-loglevel', 'warning', '-y', '-i', input,
        '-map', '0:v:0', '-map', '0:a:0?', '-vf', `scale=${profile.width}:-2`,
        '-c:v', 'libx264', '-preset', 'slow', '-crf', profile.crf, '-maxrate', profile.maxrate,
        '-bufsize', String(parseInt(profile.maxrate) * 2) + 'k', '-pix_fmt', 'yuv420p', '-g', '48',
        '-threads', '4', '-c:a', 'aac', '-b:a', profile.audio, '-movflags', '+faststart', output], { windowsHide: true, stdio: 'inherit' });
      child.on('error', reject);
      child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Video encoder exited ${code}`)));
    });
  }
  assets.film[profile.key] = '/media/optimized/' + name;
  console.log(`${profile.key}: ${((await stat(output)).size / 1024 / 1024).toFixed(1)} MiB`);
}
await writeFile(manifestPath, JSON.stringify(assets, null, 2) + '\n');
await writeFile(path.join(root, 'src/media-data.js'), '/* Generated from the original reference files. */\nconst LT_ASSETS = ' + JSON.stringify(assets) + ';\n');
