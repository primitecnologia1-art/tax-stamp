import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

// Copy only the current, declared media. The local public folder also keeps
// historic studies and originals, which must never enter a production package.
export function productionAssets() {
  let config;
  return {
    name: 'living-trace-production-assets',
    apply: 'build',
    configResolved(value) { config = value; },
    async closeBundle() {
      const root = config.root;
      const output = path.resolve(root, config.build.outDir);
      await copyFile(path.join(root, 'scripts/hosting.htaccess'), path.join(output, '.htaccess'));
      const context = {};
      vm.createContext(context);
      vm.runInContext(await readFile(path.join(root, 'src/media-data.js'), 'utf8') +
        await readFile(path.join(root, 'src/layers-data.js'), 'utf8') +
        ';this.data=[LT_ASSETS,LT_LAYER_IMAGES,LT_RECTANGLE_LAYER_IMAGES];', context);
      const files = new Set(['/favicon.svg', '/media/br.svg', '/media/gb.svg']);
      const collect = value => {
        if (typeof value === 'string' && value.startsWith('/media/')) {
          value.split(',').forEach(part => files.add(part.trim().split(' ')[0]));
        } else if (value && typeof value === 'object') Object.values(value).forEach(collect);
      };
      collect(context.data);
      const styles = await readFile(path.join(root, 'public/_next/static/css/index.BLqIrIxb.css'), 'utf8');
      for (const match of styles.matchAll(/url\((\/_next\/static\/media\/[^)]+)\)/g)) files.add(match[1]);
      for (const file of files) {
        const target = path.join(output, file.slice(1));
        if (!target.startsWith(output + path.sep)) throw new Error('Asset outside production folder');
        await mkdir(path.dirname(target), { recursive: true });
        await copyFile(path.join(root, 'public', file.slice(1)), target);
      }
      // Relative builds run unchanged in any domain and any directory.
      if (config.base === './') {
        const rewrite = async directory => {
          for (const entry of await readdir(directory, { withFileTypes: true })) {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await rewrite(file);
            else if (/\.(html|js|css)$/.test(entry.name)) {
              const content = await readFile(file, 'utf8');
              await writeFile(file, content.replace(/(?<![A-Za-z0-9_.-])\/media\//g, './media/').replace(/(?<![A-Za-z0-9_.-])\/_next\//g, './_next/').replaceAll('"/favicon.svg"', '"./favicon.svg"'));
            }
          }
        };
        await rewrite(output);
      }
      console.log(`Production assets: ${files.size} current files; references and historical media excluded.`);
    },
  };
}
