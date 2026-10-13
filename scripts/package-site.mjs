import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const allowed = new Set(['index.html', '.htaccess', 'favicon.svg', 'assets', 'media', '_next']);
for (const entry of await readdir(dist)) {
  if (!allowed.has(entry)) throw new Error(`Unexpected production file: ${entry}`);
}
const delivery = path.join(root, 'entrega');
await mkdir(delivery, { recursive: true });
const suffix = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
const archive = path.join(delivery, `living-trace-site-${suffix}.zip`);
const quote = value => "'" + value.replaceAll("'", "''") + "'";
if (process.platform !== 'win32') throw new Error('ZIP packaging currently uses the Windows compression runtime. The portable site is ready in dist/.');
await new Promise((resolve, reject) => {
  const command = `Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory(${quote(dist)}, ${quote(archive)}, [System.IO.Compression.CompressionLevel]::Optimal, $false)`;
  const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { windowsHide: true, stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`ZIP creation failed: ${code}`)));
});
await writeFile(path.join(delivery, 'COMO-PUBLICAR.txt'), `LIVING TRACE — PACOTE PARA HOSPEDAGEM

1. Extraia o ZIP e envie seu CONTEÚDO para a pasta escolhida no servidor.
   O index.html deve ficar diretamente nessa pasta, junto com assets, media,
   _next, favicon.svg e .htaccess. Não envie a pasta dist como pasta adicional.
2. Use HTTPS e abra o endereço com a barra final da pasta.
3. Nenhum domínio ou diretório foi fixado. O mesmo pacote funciona na raiz
   ou em qualquer subpasta, sem editar o código.
4. Não é necessário instalar Node, npm ou banco de dados no servidor.
5. O .htaccess configura compressão, cache e tipos de arquivo em Apache/LiteSpeed.
   Em outro servidor, peça à hospedagem compressão gzip/Brotli para HTML/JS/CSS,
   cache dos arquivos estáticos e suporte a solicitações Range para o MP4.
6. Ao substituir uma versão antiga, publique os novos arquivos antes do index.html.
   Depois da validação, arquivos antigos que não estejam neste pacote podem
   ser removidos APENAS da pasta exclusiva deste site.

O pacote contém somente a página e as mídias atuais. Não inclui references,
arquivos originais de estudo, node_modules, Git ou código-fonte de desenvolvimento.
As imagens são responsivas em WebP; a fotografia usa AVIF com alternativa WebP.
O vídeo é MP4/H.264 com áudio, início rápido e versões desktop e celular,
carregado somente quando a pessoa abre o filme.

Lighthouse: notas dependem também da rede, dispositivo e hospedagem.
Reavalie o endereço publicado; medições locais não garantem 100 em todo teste.
`, 'utf8');
console.log(`Package: ${archive} (${((await stat(archive)).size / 1024 / 1024).toFixed(1)} MiB)`);
