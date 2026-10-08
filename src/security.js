// Spatial map verified against the supplied circular and rectangular stamp artwork.
// Coordinates are normalized percentages within the original, uncropped image.
const LT_SECURITY = [
  { legacy: 0, circle: [32, 84], rectangle: [20, 49], region: ['Película holográfica', 'Holographic film'] },
  { legacy: 1, circle: [68, 77], rectangle: [14, 69], region: ['Desenho botânico em relevo', 'Raised botanical design'] },
  { legacy: 2, circle: [16, 25], rectangle: [86, 82], region: ['Fundo de linhas', 'Line background'] },
  { legacy: 3, circle: [86, 49], rectangle: [63, 38], region: ['Contorno de microtextos', 'Microtext outline'] },
  { legacy: 4, circle: [49, 22], rectangle: [79, 18], region: ['Marcas e área do QR Code', 'Marks and QR Code area'] },
  { legacy: 5, circle: [23, 80], rectangle: [19, 34], region: ['Detalhes desmetalizados', 'Demetallized details'] },
  { legacy: 6, circle: [60, 32], rectangle: [37, 47], region: ['Sequência alfanumérica', 'Alphanumeric sequence'] },
  { legacy: 7, circle: [72, 38], rectangle: [82, 54], region: ['Desenho invisível · luz UV', 'Invisible design · UV light'] },
  { legacy: null, circle: [24, 52], rectangle: [50, 63], region: ['QR Code · acesso digital', 'QR Code · digital access'] },
];
// The narrow rectangular stamp uses external labels and exact-location leaders.
// This keeps adjacent details individually tappable on a small screen.
const LT_RECT_LABELS = [[19, 125], [5, 125], [95, 125], [62, -25], [84, -25], [17, -25], [37, -25], [77, 125], [50, 125]];
const LT_CIRCLE_LABELS = [[27, 111], [77, 108], [-8, 19], [109, 57], [50, -10], [-6, 80], [83, -1], [109, 27], [-11, 51]];

function ah({ lang }) {
  const en = lang === 'en';
  const t = qs[lang];
  const [selected, setSelected] = (0, i.useState)(0);
  const [format, setFormat] = (0, i.useState)('circle');
  const [open, setOpen] = (0, i.useState)(false);
  const root = (0, i.useRef)(null);
  const macroButton = (0, i.useRef)(null);
  const el = (tag, props = {}, ...children) => {
    const { key, ...attributes } = props;
    return (children.length > 1 ? X.jsxs : X.jsx)(tag, { ...attributes, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) }, key);
  };
  const trace = {
    pt: 'Rastreabilidade · QR Code', en: 'Traceability · QR Code',
    label: { pt: 'Da prova física à identidade digital', en: 'From physical proof to digital identity' },
    body: { pt: 'O QR Code abre o ambiente de verificação do selo. A autenticação combina a imagem, os elementos de segurança e os dados registrados.', en: 'The QR Code opens the stamp verification platform. Authentication combines its image, security features and registered data.' },
  };
  const data = LT_SECURITY.map(entry => entry.legacy === null ? trace : Ys[entry.legacy]);
  const current = data[selected];
  const illustration = LT_ASSETS.details[format][selected];
  const uv = selected === 7;
  const labels = format === 'circle' ? LT_CIRCLE_LABELS : LT_RECT_LABELS;
  const choose = index => {
    LTWarmImage(LT_ASSETS.details[format][index]);
    setSelected(index);
    if (window.matchMedia('(max-width: 767px)').matches) {
      const stage = root.current.querySelector('.atlas-stage');
      if (stage.getBoundingClientRect().top < 75 || stage.getBoundingClientRect().bottom > window.innerHeight - 60) {
        const offset = window.scrollY + stage.getBoundingClientRect().top - 95;
        window.scrollTo({ top: offset, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }
  };
  (0, i.useEffect)(() => { const frame = requestAnimationFrame(() => Y.refresh()); return () => cancelAnimationFrame(frame); }, [format]);

  return el('section', { ref: root, className: 'security-explorer section-pad security-atlas', 'aria-labelledby': 'security-title' },
    el('div', { className: 'security-heading' },
      el('h2', { id: 'security-title' }, t.detailA, el('br'), el('em', {}, t.detailEm)),
      el('p', { className: 'body-copy' }, en ? 'Explore the points on the stamp. Each location reveals a security detail.' : 'Explore os pontos no selo. Cada localização revela um detalhe de segurança.'),
    ),
    el('div', { className: 'atlas-toolbar' },
      el($m, { value: format, onValueChange: setFormat, className: 'format-tabs atlas-tabs' },
        el(th, { 'aria-label': en ? 'Security stamp format' : 'Formato do selo de segurança' },
          el(nh, { value: 'circle' }, t.circular), el(nh, { value: 'rectangle' }, t.rectangular))),
      el('span', { className: 'atlas-toolbar-hint' }, en ? 'Select a point. Look closer.' : 'Escolha um ponto. Veja de perto.'),
    ),
    el('div', { className: 'atlas-layout' },
      el('div', { className: 'atlas-exhibit' },
        el('div', { className: 'atlas-map-frame' },
        el('div', { className: 'atlas-stage atlas-' + format + (uv ? ' atlas-uv' : ''), role: 'group', 'aria-label': en ? 'Security details located on the stamp' : 'Detalhes de segurança localizados no selo' },
          el('img', { ...LTSealProps(format, uv), className: 'atlas-seal', alt: t.sealImage + ' — ' + (format === 'circle' ? t.circular : t.rectangular) + (uv ? ' · UV' : ''), loading: 'lazy', decoding: 'async', draggable: false }),
          el('svg', { className: 'atlas-leaders', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': true },
            LT_SECURITY.map((entry, index) => el('g', { key: String(index), className: selected === index ? 'is-active' : '' },
              el('line', { x1: entry[format][0], y1: entry[format][1], x2: labels[index][0], y2: labels[index][1] }),
              el('circle', { cx: entry[format][0], cy: entry[format][1], r: .6 }),
            ))),
          LT_SECURITY.map((entry, index) => el('button', {
            key: String(index), type: 'button', className: 'atlas-point' + (selected === index ? ' is-active' : ''),
            style: { left: labels[index][0] + '%', top: labels[index][1] + '%' },
            'aria-label': String(index + 1).padStart(2, '0') + '. ' + data[index][lang], 'aria-pressed': selected === index,
            onClick: () => choose(index),
          }, String(index + 1).padStart(2, '0'))),
        )),
        el('div', { className: 'atlas-caption' }, el('span', {}, format === 'circle' ? t.circular : t.rectangular), el('span', {}, uv ? 'UV' : (en ? 'VISIBLE LIGHT' : 'LUZ VISÍVEL'))),
        el('div', { className: 'atlas-detail', 'aria-live': 'polite', 'aria-atomic': true },
          el('figure', { className: 'atlas-macro-figure' },
            el('button', { ref: macroButton, type: 'button', className: 'atlas-macro', 'aria-haspopup': 'dialog', 'aria-label': t.enlarge + ': ' + current[lang], onPointerEnter: () => LTWarmImage(illustration), onFocus: () => LTWarmImage(illustration), onClick: () => { LTWarmImage(illustration); setOpen(true); } },
              el('img', { src: illustration.variants[0].webp, srcSet: illustration.srcSet, sizes: '(max-width: 767px) 126px, 176px', alt: t.detailImage + ': ' + current[lang], width: illustration.width, height: illustration.height, loading: 'lazy', decoding: 'async' }),
              el('span', { className: 'atlas-macro-expand', 'aria-hidden': true }, '+')),
            el('figcaption', {}, t.enlarge)),
          el('div', { className: 'atlas-detail-copy' },
            el('p', { className: 'atlas-detail-index' }, String(selected + 1).padStart(2, '0') + ' / ' + (en ? 'THE DETAIL' : 'O DETALHE')),
            el('h3', {}, current[lang]), el('p', {}, current.body[lang])),
        ),
      ),
      el('nav', { className: 'atlas-index', 'aria-label': en ? 'Nine details of the stamp' : 'Nove detalhes do selo' },
        el('p', { className: 'atlas-index-title' }, en ? '09 ways to look closer' : '09 formas de olhar mais perto'),
        data.map((entry, index) => el('button', { key: String(index), type: 'button', className: 'atlas-item' + (selected === index ? ' is-active' : ''), 'aria-pressed': selected === index, onClick: () => choose(index) },
          el('span', {}, String(index + 1).padStart(2, '0')), el('span', {}, entry[lang]), el('span', { 'aria-hidden': true }, index === selected ? '−' : '+'))),
      ),
    ),
    open ? el(Hm, { open, onOpenChange: setOpen }, el(Gm, { className: 'detail-dialog atlas-dialog', showCloseButton: false, onCloseAutoFocus: event => { event.preventDefault(); macroButton.current?.focus({ preventScroll: true }); } },
      el('div', { className: 'film-top' }, el('div', {}, el(Km, {}, current[lang]), el(qm, {}, current.label[lang])),
        el('button', { className: 'close-control', 'aria-label': t.close, onClick: () => setOpen(false) }, el(Ym))),
      el('div', { className: 'atlas-dialog-content' },
        el('img', { src: illustration.src, srcSet: illustration.srcSet, sizes: '(max-width: 767px) 90vw, 650px', width: illustration.width, height: illustration.height, loading: 'eager', decoding: 'async', alt: t.detailImage + ': ' + current[lang] }),
        el('div', {}, el('p', { className: 'atlas-detail-index' }, LT_SECURITY[selected].region[en ? 1 : 0]), el('p', {}, current.body[lang]))))) : null,
  );
}
