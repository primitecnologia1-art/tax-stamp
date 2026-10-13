// Component source inserted into the preserved React runtime by the local build.
// The runtime provides React (i), JSX helpers (X), GSAP (Si), and ScrollTrigger (Y).
const LT_LAYERS = [
  { file: '1CAMADA.png', pt: 'Fundo de segurança', en: 'Security background', body: ['As linhas finas formam a base gráfica que sustenta a identidade do selo.', 'Fine lines form the graphic foundation of the stamp’s identity.'] },
  { file: '2CAMADA.png', pt: 'Impressão com Tonalidade Variável', en: 'Variable Tone Printing', body: ['A impressão dos textos e marcas varia de tonalidade conforme o ângulo de observação.', 'Printed text and marks change tone with the viewing angle.'] },
  { file: '3CAMADA.png', pt: 'Holografia', en: 'Holography', body: ['Efeitos multicoloridos respondem à luz e ao ângulo de observação.', 'Multicolored effects respond to light and viewing angle.'] },
  { file: '4CAMADA.png', pt: 'Calcografia', en: 'Intaglio', body: ['O desenho botânico em relevo conecta o papel à holografia.', 'The raised botanical design connects the paper and holography.'] },
  { file: '5CAMADA.png', pt: 'Desmetalização', en: 'Demetallization', body: ['A remoção seletiva do metal desenha os detalhes personalizados da película holográfica.', 'Selective metal removal creates custom details in the holographic film.'] },
  { file: '6CAMADAPERFURACAO.png', pt: 'Microperfuração', en: 'Microperforation', body: ['A sequência alfanumérica é formada por microperfurações permanentes no suporte.', 'Permanent microperforations in the substrate form the alphanumeric sequence.'] },
  { file: '7CAMADARASTREABILIDADE.png', pt: 'Rastreabilidade', en: 'Traceability', body: ['O QR Code conecta o selo físico ao ambiente de verificação digital.', 'The QR Code connects the physical stamp to the digital verification platform.'] },
  { file: '8CAMADAINVISIVEL.png', pt: 'Impressão invisível', en: 'Invisible printing', body: ['A impressão só se revela sob luz UV. Uma faixa de luz percorre o desenho original, sem tirá-lo de sua posição na construção do selo.', 'The print only reveals itself under UV light. A band of light passes over the original design without moving it out of its position in the stamp.'] },
];

function Qm({ lang }) {
  const en = lang === 'en';
  const root = (0, i.useRef)(null);
  const el = (tag, props = {}, ...children) => {
    const { key, ...attributes } = props;
    return (children.length > 1 ? X.jsxs : X.jsx)(tag, { ...attributes, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) }, key);
  };

  (0, i.useEffect)(() => {
    const media = Si.matchMedia();
    media.add({ always: 'all', mobile: '(max-width: 767px)', compact: '(max-width: 767px) and (max-height: 740px)', shortDesktop: '(min-width: 768px) and (max-height: 800px)' }, context => {
      const mobile = context.conditions.mobile;
      const planes = root.current.querySelectorAll('.seal-plane');
      const paint = value => {
        const pose = value;
        planes.forEach(plane => Si.set(plane, {
          y: (3.5 - Number(plane.dataset.layerIndex)) * (mobile ? (context.conditions.compact ? 13 : 18) : (context.conditions.shortDesktop ? 32 : 40)) * pose,
          x: (3.5 - Number(plane.dataset.layerIndex)) * (mobile ? 2 : 7) * pose,
          rotationX: 70 * pose,
          rotationZ: -12 - 13 * pose,
          scale: 1 - pose * .04,
        }));
        root.current.style.setProperty('--spread', String(value));
      };
      const proxy = { value: 0 };
      paint(proxy.value);
      Si.to(proxy, { value: 1, ease: 'none', onUpdate: () => paint(proxy.value), scrollTrigger: {
        trigger: root.current, start: () => 'top -' + window.innerHeight * .65, end: 'bottom bottom', scrub: .55, invalidateOnRefresh: true,
      } });
    }, root);
    return () => media.revert();
  }, []);

  const stamp = format => {
    const rectangular = format === 'rectangle';
    const images = rectangular ? LT_RECTANGLE_LAYER_IMAGES : LT_LAYER_IMAGES;
    return el('div', { className: 'explosion-visual explosion-' + format, role: 'group', 'aria-label': (en ? 'Eight layers — ' : 'Oito camadas — ') + (rectangular ? (en ? 'rectangular stamp' : 'selo retangular') : (en ? 'circular stamp' : 'selo circular')) },
      LT_LAYERS.map((layer, index) => el('div', {
        key: format + layer.file,
        className: 'seal-plane' + (index === 7 ? ' invisible-plane' : '') + (index === 6 || index === 4 ? ' white-ink-plane' : ''),
        'data-layer-index': index, style: { zIndex: index + 1 },
      }, el('span', { className: 'plane-surface' },
        el('img', { ...images[index], sizes: rectangular ? '(max-width: 767px) 76vw, (max-width: 1100px) 42vw, 580px' : '(max-width: 767px) 42vw, (max-width: 1100px) 30vw, 410px', alt: layer[lang], loading: 'lazy', decoding: 'async', draggable: false }),
        index === 7 ? el('span', { className: 'uv-ray', 'aria-hidden': true }) : null,
      ))),
    );
  };

  return el('section', { ref: root, className: 'layers-scene layers-v2 layers-dual', id: 'camadas', 'aria-labelledby': 'layers-title' },
    el('div', { className: 'layers-sticky section-pad' },
      el('div', { className: 'layers-heading' },
        el('p', { className: 'chapter-label' }, en ? '02 / LAYERS' : '02 / CAMADAS'),
        el('h2', { id: 'layers-title' }, en ? 'One identity.' : 'Uma identidade.', el('br'), en ? 'Many ' : 'Muitas ', el('em', {}, en ? 'layers.' : 'camadas.')),
        el('p', { className: 'scene-hint' }, en ? 'Scroll to reveal the layers.' : 'Role para revelar as camadas.'),
      ),
      stamp('circle'),
      stamp('rectangle'),
      el('div', { className: 'dual-layer-caption' },
        el('p', {}, en ? 'Two formats. The same construction.' : 'Dois formatos. A mesma construção.'),
      ),
      el('span', { className: 'scene-axis', 'aria-hidden': true }, 'TAX STAMP / EXPLODED VIEW'),
    ),
  );
}
