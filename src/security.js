// Security-item copy and positioning are centralized here for straightforward editing.
const LT_SECURITY = [
  { circle: [32, 84], rectangle: [20, 49], region: ['Película holográfica', 'Holographic film'] },
  { circle: [68, 77], rectangle: [14, 69], region: ['Desenho botânico em relevo', 'Raised botanical design'] },
  { circle: [16, 25], rectangle: [86, 82], region: ['Fundo de linhas', 'Line background'] },
  { circle: [86, 49], rectangle: [63, 38], region: ['Contorno de microtextos', 'Microtext outline'] },
  { circle: [49, 22], rectangle: [79, 18], region: ['Marcas e área do QR Code', 'Marks and QR Code area'] },
  { circle: [23, 80], rectangle: [19, 34], region: ['Detalhes desmetalizados', 'Demetallized details'] },
  { circle: [60, 32], rectangle: [37, 47], region: ['Sequência alfanumérica', 'Alphanumeric sequence'] },
  { circle: [72, 38], rectangle: [82, 54], region: ['Desenho invisível · luz UV', 'Invisible design · UV light'] },
  { circle: [24, 52], rectangle: [50, 63], region: ['QR Code · acesso digital', 'QR Code · digital access'] },
  { circle: [78, 62], rectangle: [70, 82], region: ['Papel de segurança', 'Security paper'] },
];

const LT_SECURITY_COPY = [
  {
    pt: 'Holografia de Alta Segurança', en: 'High-security holography',
    label: { pt: 'A luz em movimento', en: 'Light in motion' },
    body: {
      pt: 'A holografia combina efeitos multicoloridos, imagens 2D/3D e textos alternados “VÁLIDO” / “OK”, que se modificam conforme o ângulo de visualização. Além da autenticação, as variações de luz e cor acrescentam contraste e movimento visual, criando uma camada dinâmica integrada à composição botânica.',
      en: 'The holographic foil combines multicolour effects, 2D/3D imagery and alternating “VALID” / “OK” texts that change with the viewing angle. Beyond authentication, the shifting light and colour introduce contrast and visual movement, creating a dynamic layer that interacts with the botanical composition.',
    },
  },
  {
    pt: 'Calcografia sobre Holografia', en: 'Intaglio over holography',
    label: { pt: 'Uma dimensão tátil', en: 'A tactile dimension' },
    body: {
      pt: 'A arte botânica em verde é impressa em calcografia sobre o papel e também sobre a película holográfica, criando continuidade visual entre materiais distintos. O relevo da tinta acrescenta uma dimensão tátil ao selo, enquanto as linhas botânicas contínuas reforçam a ideia de uma única identidade construída em múltiplas camadas.',
      en: 'The green botanical artwork is printed in intaglio across both the paper substrate and the holographic foil, creating visual continuity between two different materials. The raised ink adds a distinctive tactile dimension, while the uninterrupted botanical lines reinforce the idea of a single, cohesive identity built across multiple layers.',
    },
  },
  {
    pt: 'Impressão íris', en: 'Iris printing',
    label: { pt: 'Transição sem retículas', en: 'A transition without halftones' },
    body: {
      pt: 'A impressão íris controlada em máquina cria transições contínuas de cor sobre o fundo formado por linhas, sem o uso de retículas. O efeito acrescenta profundidade e movimento visual, fazendo com que o padrão de segurança se torne parte integrante do design, e não apenas um recurso técnico.',
      en: 'Machine-controlled iris printing creates seamless colour transitions across the line-based background, without the use of halftone screens. The effect introduces depth and visual movement, allowing the security pattern to become an integral part of the design rather than a purely technical feature.',
    },
  },
  {
    pt: 'Microtextos Personalizados', en: 'Custom microtext',
    label: { pt: 'Menos de 0,4 mm', en: 'Less than 0.4 mm' },
    body: {
      pt: 'Textos com altura inferior a 0,4 mm acompanham as linhas finas do fundo, incorporando informações legíveis diretamente ao padrão ornamental. O microtexto passa a fazer parte da textura gráfica, acrescentando detalhe, densidade visual e precisão à composição.',
      en: 'Text below 0.4 mm follows the fine-line background, embedding readable information directly into the ornamental pattern. The microtext becomes part of the graphic texture, adding detail, density and precision to the design.',
    },
  },
  {
    pt: 'Tinta Opticamente Variável (OVI)', en: 'Optically Variable Ink (OVI)',
    label: { pt: 'A cor responde ao ângulo', en: 'Color responds to the angle' },
    body: {
      pt: 'Aplicada sobre os textos na área do QR Code, a tinta OVI apresenta mudança de cor conforme o ângulo de visualização. O efeito cria um elemento de autenticação visual imediata e, ao mesmo tempo, destaca áreas importantes da composição.',
      en: 'Applied to the lettering and QR code, OVI produces a colour-shifting effect as the viewing angle changes. The effect creates an immediate visual authentication feature while giving emphasis and hierarchy to key areas of the design.',
    },
  },
  {
    pt: 'Desmetalização e Micronumeração', en: 'Demetallization and Micro-Numbering',
    label: { pt: 'Identificação pericial', en: 'Forensic identification' },
    body: {
      pt: 'Áreas selecionadas da película holográfica são desmetalizadas para formar elementos gráficos personalizados, enquanto a micronumeração acrescenta uma camada adicional de identificação individual. Integrados ao mesmo campo visual, esses recursos combinam informação, segurança e design em detalhes de alta precisão.',
      en: 'Selected areas of the holographic foil are demetallized to create custom graphics, while micro-numbering adds individual identification. Integrated into the same visual field, both features combine security, information and design with fine detail.',
    },
  },
  {
    pt: 'Microperfuração Alfanumérica', en: 'Alphanumeric Microperforation',
    label: { pt: 'Rastreabilidade indelével', en: 'Indelible traceability' },
    body: {
      pt: 'A sequência perfurada é integrada ao fundo impresso, fazendo com que a informação variável faça parte da composição gráfica. Os caracteres são formados por microperfurações permanentes no próprio substrato.',
      en: 'The perforated sequence is visually integrated with the printed background, allowing variable information to become part of the overall composition rather than an added element.',
    },
  },
  {
    pt: 'Impressão invisível reagente à luz UV', en: 'UV-reactive invisible printing',
    label: { pt: 'A luz revela outra camada', en: 'Light reveals another layer' },
    body: {
      pt: 'Sob luz ultravioleta, folhas, gotas e formas inspiradas na vida surgem, revelando uma nova dimensão do mesmo desenho. Alguns sinais de autenticidade estão visíveis. Outros aguardam a luz certa para serem revelados.',
      en: 'Under ultraviolet light, hidden leaves, droplets and living forms emerge, revealing another dimension of the same design. Some signs of authenticity are visible, while others wait for the right light.',
    },
  },
  {
    pt: 'Rastreabilidade · QR Code', en: 'Traceability · QR Code',
    label: { pt: 'Da prova física à identidade digital', en: 'From physical proof to digital identity' },
    body: {
      pt: 'Leia o QR Code do selo para acessar a validação. Cada selo possui uma identidade digital única vinculada aos seus elementos físicos de segurança. Ao ler o código pelo celular, o usuário pode verificar o selo sem instalar aplicativo.',
      en: 'Read the seal’s QR code to open the validator. Each tax stamp carries a unique digital identity linked to its physical security features, allowing verification by smartphone without installing an app.',
    },
  },
  {
    pt: 'Substrato de segurança', en: 'Security substrate',
    label: { pt: 'Segurança incorporada ao papel', en: 'Security built into the paper' },
    body: {
      pt: 'Papel de segurança com baixa coesão interna controlada. Ao ser removido, sua estrutura se rompe, dificultando a reutilização ou transferência do selo. A massa do papel também incorpora fibras de segurança invisíveis sob luz normal, que se tornam visíveis sob iluminação UV, acrescentando uma camada adicional de autenticação.',
      en: 'Security paper with controlled low internal cohesion. If removal is attempted, the paper structure breaks apart, making the seal difficult to reuse or transfer. The paper also contains security fibers embedded directly into the substrate, invisible under normal light and revealed under UV illumination, adding an additional layer of authentication.',
    },
  },
];

const LT_RECT_LABELS = [[19, 125], [5, 125], [95, 125], [62, -25], [84, -25], [17, -25], [37, -25], [77, 125], [50, 125], [64, 125]];
const LT_CIRCLE_LABELS = [[27, 111], [77, 108], [-8, 19], [109, 57], [50, -10], [-6, 80], [83, -1], [109, 27], [-11, 51], [103, 91]];

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
  const data = LT_SECURITY_COPY;
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
      el('p', { className: 'body-copy' }, en ? 'Explore the seal. Each point reveals a security layer integrated into the design.' : 'Explore os pontos do selo. Cada um revela uma camada de segurança integrada ao design.'),
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
            }, String(index + 1).padStart(2, '0')),
          )),
        ),
        el('div', { className: 'atlas-caption' }, el('span', {}, format === 'circle' ? t.circular : t.rectangular), el('span', {}, uv ? 'UV' : (en ? 'VISIBLE LIGHT' : 'LUZ VISÍVEL'))),
        el('div', { className: 'atlas-detail', 'aria-live': 'polite', 'aria-atomic': true },
          el('figure', { className: 'atlas-macro-figure' },
            el('button', { ref: macroButton, type: 'button', className: 'atlas-macro' + (selected === 9 ? ' is-substrate' : ''), 'aria-haspopup': 'dialog', 'aria-label': t.enlarge + ': ' + current[lang], onPointerEnter: () => LTWarmImage(illustration), onFocus: () => LTWarmImage(illustration), onClick: () => { LTWarmImage(illustration); setOpen(true); } },
              el('span', { className: 'atlas-macro-crop' }, el('img', { src: illustration.variants[0].webp, srcSet: illustration.srcSet, sizes: '(max-width: 767px) 126px, 176px', alt: t.detailImage + ': ' + current[lang], width: illustration.width, height: illustration.height, loading: 'lazy', decoding: 'async' })),
              el('span', { className: 'atlas-macro-expand', 'aria-hidden': true }, '+')),
            el('figcaption', {}, t.enlarge)),
          el('div', { className: 'atlas-detail-copy' },
            el('p', { className: 'atlas-detail-index' }, String(selected + 1).padStart(2, '0') + ' / ' + (en ? 'THE DETAIL' : 'O DETALHE')),
            el('h3', {}, current[lang]), el('p', {}, current.body[lang])),
        ),
      ),
      el('nav', { className: 'atlas-index', 'aria-label': en ? 'Ten security layers' : 'Dez camadas de segurança' },
        el('p', { className: 'atlas-index-title' }, en ? '10 layers to discover' : '10 camadas para descobrir'),
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
