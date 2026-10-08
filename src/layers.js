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
  const [selected, setSelected] = (0, i.useState)(null);
  const root = (0, i.useRef)(null);
  const selectedRef = (0, i.useRef)(null);
  const scrollAnchor = (0, i.useRef)(0);
  const scrollIntent = (0, i.useRef)(false);
  const spread = (0, i.useRef)(0);
  const heldPose = (0, i.useRef)(0);
  const paint = (0, i.useRef)(null);
  const el = (tag, props = {}, ...children) => {
    const { key, ...attributes } = props;
    return (children.length > 1 ? X.jsxs : X.jsx)(tag, { ...attributes, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) }, key);
  };

  (0, i.useEffect)(() => {
    const media = Si.matchMedia();
    media.add({ mobile: '(max-width: 767px)', compact: '(max-width: 767px) and (max-height: 740px)', shortDesktop: '(min-width: 768px) and (max-height: 800px)', motion: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const mobile = context.conditions.mobile;
      const planes = root.current.querySelectorAll('.seal-plane');
      paint.current = value => {
        spread.current = value;
        const pose = selectedRef.current === null ? value : heldPose.current;
        planes.forEach((plane, index) => Si.set(plane, {
          y: (3.5 - index) * (mobile ? (context.conditions.compact ? 15 : 25) : (context.conditions.shortDesktop ? 45 : 57)) * pose,
          x: (3.5 - index) * (mobile ? 3 : 9) * pose,
          rotationX: 70 * pose,
          rotationZ: -12 - 13 * pose,
          scale: 1 - pose * .04,
        }));
        root.current.style.setProperty('--spread', String(value));
      };
      const proxy = { value: context.conditions.reduced ? 1 : 0 };
      paint.current(proxy.value);
      if (!context.conditions.reduced) {
        Si.to(proxy, { value: 1, ease: 'none', onUpdate: () => paint.current?.(proxy.value), scrollTrigger: {
          trigger: root.current, start: () => 'top -' + window.innerHeight, end: 'bottom bottom', scrub: .55, invalidateOnRefresh: true,
        } });
      }
    }, root);
    const resume = () => {
      if (selectedRef.current === null || !scrollIntent.current || Math.abs(window.scrollY - scrollAnchor.current) < 7) return;
      selectedRef.current = null;
      setSelected(null);
      paint.current?.(spread.current);
    };
    const escape = event => {
      if (event.key === 'Escape') { selectedRef.current = null; setSelected(null); paint.current?.(spread.current); }
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) scrollIntent.current = true;
    };
    const intent = () => { scrollIntent.current = true; };
    const pointerIntent = event => {
      if (event.clientX >= document.documentElement.clientWidth || event.target.closest?.('a[href^="#"]')) intent();
    };
    window.addEventListener('scroll', resume, { passive: true });
    window.addEventListener('wheel', intent, { passive: true });
    window.addEventListener('touchmove', intent, { passive: true });
    window.addEventListener('pointerdown', pointerIntent, { passive: true });
    window.addEventListener('keydown', escape);
    return () => {
      media.revert();
      window.removeEventListener('scroll', resume);
      window.removeEventListener('wheel', intent);
      window.removeEventListener('touchmove', intent);
      window.removeEventListener('pointerdown', pointerIntent);
      window.removeEventListener('keydown', escape);
    };
  }, []);

  const select = index => {
    const next = selectedRef.current === index ? null : index;
    if (selectedRef.current === null && next !== null) heldPose.current = spread.current;
    selectedRef.current = next;
    scrollAnchor.current = window.scrollY;
    scrollIntent.current = false;
    setSelected(next);
    paint.current?.(spread.current);
  };

  const copy = selected === null
    ? (en ? 'Choose a layer. Keep scrolling to continue the animation.' : 'Escolha uma camada. Continue rolando para retomar a animação.')
    : LT_LAYERS[selected].body[en ? 1 : 0];

  return el('section', { ref: root, className: 'layers-scene layers-v2', id: 'camadas', 'aria-labelledby': 'layers-title' },
    el('div', { className: 'layers-sticky section-pad' },
      el('div', { className: 'layers-heading' },
        el('p', { className: 'chapter-label' }, en ? '02 / LAYERS' : '02 / CAMADAS'),
        el('h2', { id: 'layers-title' }, en ? 'One identity.' : 'Uma identidade.', el('br'), en ? 'Many ' : 'Muitas ', el('em', {}, en ? 'layers.' : 'camadas.')),
        el('p', { className: 'scene-hint' }, en ? 'Scroll to separate. Select to look closer.' : 'Role para separar. Selecione para ver de perto.'),
      ),
      el('div', { className: 'explosion-visual' + (selected === null ? '' : ' has-selection'), 'aria-label': en ? 'Eight original layers of the stamp' : 'Oito camadas originais do selo' },
        LT_LAYERS.map((layer, index) => el('div', {
          key: layer.file, className: 'seal-plane' + (selected === index ? ' is-selected' : '') + (index === 7 ? ' invisible-plane' : '') + (index === 6 || index === 4 ? ' white-ink-plane' : ''),
          style: { zIndex: index + 1 }, 'aria-hidden': selected !== null && selected !== index,
        }, el('div', { className: 'plane-surface' },
          el('img', { ...LT_LAYER_IMAGES[index], alt: layer[lang], loading: 'lazy', decoding: 'async', draggable: false }),
          index === 7 ? el('span', { className: 'uv-ray', 'aria-hidden': true }) : null,
        ))),
      ),
      el('div', { className: 'layer-index' },
        LT_LAYERS.map((layer, index) => el('button', {
          key: layer.file, type: 'button', className: 'layer-label' + (selected === index ? ' is-active' : ''),
          'aria-pressed': selected === index, onClick: () => select(index),
        }, el('span', { className: 'layer-number' }, String(index + 1).padStart(2, '0')), el('span', {}, layer[lang]), el('span', { className: 'layer-mark', 'aria-hidden': true }, selected === index ? '−' : '+'))),
        el('div', { className: 'layer-description', 'aria-live': 'polite' }, copy),
        selected !== null ? el('button', { className: 'text-control layer-clear', type: 'button', onClick: () => select(selected) }, en ? 'View all layers' : 'Ver todas as camadas') : null,
      ),
      el('span', { className: 'scene-axis', 'aria-hidden': true }, 'TAX STAMP / EXPLODED VIEW'),
    ),
  );
}
