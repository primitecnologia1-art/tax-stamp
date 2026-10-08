function Xm({ open, onOpenChange, lang }) {
  const t = qs[lang];
  const [error, setError] = i.useState(false);
  const [waiting, setWaiting] = i.useState(true);
  const video = i.useRef(null);
  const mobile = typeof window !== 'undefined' && (window.matchMedia('(max-width: 767px)').matches || navigator.connection?.saveData);
  const source = mobile ? LT_ASSETS.film.mobile : LT_ASSETS.film.desktop;
  i.useEffect(() => {
    if (open) { setError(false); setWaiting(true); }
    const playing = video.current;
    return () => playing?.pause();
  }, [open]);
  const changeOpen = value => { if (!value) video.current?.pause(); onOpenChange(value); };
  const close = () => changeOpen(false);
  return X.jsx(Hm, { open, onOpenChange: changeOpen, children: X.jsxs(Gm, { className: 'film-dialog', showCloseButton: false, children: [
    X.jsxs('div', { className: 'film-top', children: [
      X.jsxs('div', { children: [X.jsx(Km, { children: 'Living Trace' }), X.jsx(qm, { children: t.filmLanguage })] }),
      X.jsx('button', { className: 'close-control', 'aria-label': t.close, onClick: close, children: X.jsx(Ym, {}) }),
    ] }),
    open && X.jsxs('div', { className: 'film-player', 'aria-busy': waiting && !error, children: [
      X.jsx('video', { ref: video, className: 'film-video', src: source, controls: true, autoPlay: true, playsInline: true,
        preload: 'auto', poster: LT_ASSETS.film.poster,
        onPlaying: () => setWaiting(false), onCanPlay: () => setWaiting(false), onWaiting: () => setWaiting(true),
        onError: () => { setWaiting(false); setError(true); } }),
      waiting && !error && X.jsx('span', { className: 'film-loading', role: 'status', children: lang === 'en' ? 'Preparing the film…' : 'Preparando o filme…' }),
    ] }),
    error && X.jsxs('p', { className: 'film-error', children: [t.filmError, ' ',
      X.jsx('button', { className: 'text-control', onClick: () => { setError(false); setWaiting(true); video.current?.load(); video.current?.play().catch(() => {}); }, children: lang === 'en' ? 'Try again' : 'Tentar novamente' }), ' · ',
      X.jsx('a', { href: source, target: '_blank', rel: 'noreferrer', children: t.downloadFilm }),
    ] }),
  ] }) });
}
