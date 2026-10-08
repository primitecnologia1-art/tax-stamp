# PRIMI × BP Security — Living Trace

Versão local da experiência digital Living Trace.

## Executar localmente

```bash
npm install
npm run dev
```

O endereço local será exibido no terminal.

As mídias finais já estão incluídas no projeto. Não é necessário converter imagens ou vídeos para executar o site.

## Cloudflare Tunnel

O Vite permite os endereços `*.trycloudflare.com`, tanto no desenvolvimento quanto na prévia de produção. Um Quick Tunnel pode apontar para `http://127.0.0.1:5173`. Se usar um domínio próprio no Cloudflare, acrescente esse domínio à lista `tunnelHosts` em `vite.config.js`. A lista explícita mantém outros hosts bloqueados; o projeto não inicia um túnel automaticamente.

## Gerar a versão de produção

```bash
npm run build
npm run preview
```

## Publicar no Vercel

Importe esta pasta como um novo projeto no Vercel. A configuração em `vercel.json` executa `npm run build` e publica a pasta `dist`.

## Estrutura

- `index.html`: documento atual da experiência.
- `src/layers.js` e `src/security.js`: fontes editáveis das camadas e do mapa de segurança.
- `src/origin.js` e `src/motion.js`: narrativa visual e transições ópticas controladas pela rolagem.
- `src/film.js` e `src/media.js`: filme final, imagens responsivas e preparação do próximo capítulo.
- `src/main.js` e `src/hydrate.js`: entrada local leve; o HTML completo aparece antes da inicialização das interações.
- `public/local-overrides.css`: ajustes visuais locais e responsivos.
- `scripts/apply-local-adjustments.mjs`: integra as fontes editáveis ao runtime preservado e atualiza o HTML antes de executar ou compilar.
- `scripts/prepare-styles.mjs`: remove utilitários não utilizados, preservando os estilos autorais e dos controles.
- `public/media/`: somente as imagens, vídeos, PDFs e bandeiras utilizados pelo site.
- `public/_next/`: estilos, fontes e código de interação preservados da versão aprovada.
- `src/media-data.js` e `src/layers-data.js`: manifestos das mídias finais publicadas.

Todos os próximos ajustes devem ser feitos nesta pasta.

## Mídias publicadas

As oito camadas da explosão são servidas de `public/media/layers-registered/`. Todas compartilham uma tela de **710 × 710 px**, mantendo tamanho, posição e registro.

Os detalhes ampliados, selos visíveis e versões UV são servidos nas resoluções responsivas listadas em `src/media-data.js`. Os pontos de localização permanecem em `src/security.js`.

O filme possui versões finais de 1920 px para desktop e 960 px para celular, preservando som e duração. O vídeo só é solicitado ao abrir o player.

A pasta local `references/` continua disponível no computador para futuras alterações, mas é totalmente ignorada pelo Git e não faz parte do repositório ou do deploy.

## Desempenho

Imagens AVIF com alternativa WebP, tamanhos responsivos, dimensões reservadas, carregamento prioritário da abertura, antecipação do próximo capítulo, arquivos versionados e folha de estilos incorporada ao HTML. A animação UV pausa fora da tela. A importação do runtime acontece após a primeira exibição, com ativação imediata caso o visitante clique em um controle durante o início.

As auditorias de desempenho devem ser feitas na versão de produção (`npm run build` + `npm run preview`), não no servidor de desenvolvimento. As medições locais não garantem uma nota fixa em toda rede, dispositivo ou hospedagem; repita a avaliação no endereço publicado no Vercel.

Arquivos-fonte de referência, caches, extrações de estudo e mídias antigas não são versionados. Um clone limpo já contém apenas os arquivos finais necessários para executar e publicar o site.
