// Preserve the accepted opening while keeping its local source editable.
function LTHero({ lang, onFilm }) {
  const t = qs[lang];
  const el = (tag, props = {}, ...children) => (children.length > 1 ? X.jsxs : X.jsx)(tag, {
    ...props, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {})
  });
  return el('section', { className: 'hero', id: 'inicio', 'aria-labelledby': 'hero-title' },
    el('div', { className: 'hero-media' }, el(LTPhoto, { name: 'leaf', eager: true, framing: 'hero' })),
    el('div', { className: 'hero-shade' }),
    el('div', { className: 'hero-content section-pad' },
      el('h1', { id: 'hero-title', 'aria-label': `${t.heroA} ${t.heroB} ${t.heroEm}` },
        el('span', {}, t.heroA), el('span', {}, t.heroB, ' ', el('em', {}, t.heroEm))),
      el('p', { className: 'hero-intro' }, t.intro),
      el('div', { className: 'hero-bottom' },
        el('button', { className: 'film-control ', onClick: onFilm },
          el('span', { className: 'play-circle' }, el('svg', { viewBox: '0 0 24 24', 'aria-hidden': true },
            el('path', { d: 'M8 5.5 19 12 8 18.5Z', fill: 'currentColor' }))),
          el('span', {}, t.watch), el('span', { className: 'film-time' }, LT_ASSETS.film.duration)),
        el('a', { className: 'scroll-cue', href: '#origem' }, t.scroll,
          el('span', { className: 'scroll-line', 'aria-hidden': true })))));
}

// A photographic optical journey: leaf → water → fibers → actual stamp.
function LTOrigin({ lang }) {
  const t = qs[lang];
  const el = (tag, props = {}, ...children) => {
    const { key, ...attributes } = props;
    return (children.length > 1 ? X.jsxs : X.jsx)(tag, { ...attributes, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) }, key);
  };
  return el('section', { className: 'origin-scene origin-optical', id: 'origem', 'aria-labelledby': 'origin-title' },
    el('div', { className: 'origin-sticky' },
      el('div', { className: 'origin-images', 'aria-hidden': true },
        ['dew', 'leaf', 'matter'].map(asset => el(LTPhoto, { key: asset, name: asset, className: 'origin-image origin-' + asset })),
        el('div', { className: 'optical-contour' }),
      ),
      el('div', { className: 'origin-shade' }),
      el('div', { className: 'origin-content section-pad' },
        el('p', { className: 'chapter-label' }, '01 / ', t.nav[0]),
        el('h2', { id: 'origin-title' }, t.originTitle, el('br'), el('em', {}, t.originEm)),
        el('div', { className: 'origin-bottom' },
          el('div', { className: 'origin-lines' }, t.originLines.map((line, index) => el('p', { key: String(index), className: 'origin-line origin-line-' + index }, line))),
          el('p', {}, t.originBody))),
    ));
}
