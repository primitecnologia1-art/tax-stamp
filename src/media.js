// Responsive artwork: the browser chooses one file, never both mobile and desktop.
function LTPhoto({ name, className, eager = false, framing = 'center' }) {
  const photo = LT_ASSETS.photos[name];
  const desktop = photo.desktop;
  const mobile = (framing === 'hero' ? photo.heroMobile : framing === 'closing' ? photo.closingMobile : photo.mobile) ?? photo.mobile;
  const portrait = '(max-width: 767px) and (max-aspect-ratio: 9/16)';
  const portraitSize = 'max(100vw, 56.25svh)';
  const coverSize = 'max(100vw, 177.78svh)';
  return X.jsxs('picture', { className, children: [
    X.jsx('source', { media: portrait, type: 'image/avif', srcSet: mobile.avifSrcSet, sizes: portraitSize }),
    X.jsx('source', { media: portrait, type: 'image/webp', srcSet: mobile.srcSet, sizes: portraitSize }),
    X.jsx('source', { type: 'image/avif', srcSet: desktop.avifSrcSet, sizes: coverSize }),
    X.jsx('img', { src: desktop.src, srcSet: desktop.srcSet, sizes: coverSize, width: desktop.width, height: desktop.height,
      alt: '', loading: eager ? 'eager' : 'lazy', fetchPriority: eager ? 'high' : 'low', decoding: 'async' }),
  ] });
}

function LTSealProps(format = 'circle', uv = false) {
  const asset = LT_ASSETS.seals[format + (uv ? '-uv' : '')];
  return { src: asset.variants[0].webp, srcSet: asset.srcSet,
    sizes: format === 'circle' ? '(max-width: 767px) 78vw, 520px' : '(max-width: 767px) 88vw, 850px',
    width: asset.width, height: asset.height };
}

const LT_WARMED = new Set();
function LTWarmImage(asset, sizes = '(max-width: 767px) 90vw, 650px') {
  if (LT_WARMED.has(asset.src)) return;
  LT_WARMED.add(asset.src);
  const image = new Image();
  image.decoding = 'async';
  image.sizes = sizes;
  image.srcset = asset.srcSet;
  image.src = asset.src;
  image.decode().catch(() => LT_WARMED.delete(asset.src));
}

// Warm the next chapter before it is visible, including fast anchor navigation.
function LTPrepareMedia() {
  const sections = document.querySelectorAll('main > section');
  const warm = section => {
    section?.querySelectorAll('img[loading="lazy"]').forEach(image => {
      image.loading = 'eager';
      image.decode().catch(() => {});
    });
    if (section?.id === 'luz' || section?.classList.contains('security-atlas')) {
      // Both formats and UV are ready before the visitor changes a tab.
      Object.values(LT_ASSETS.seals).forEach(asset => LTWarmImage(asset));
    }
    if (section?.classList.contains('security-atlas')) LTWarmImage(LT_ASSETS.details.circle[0]);
  };
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { warm(entry.target); observer.unobserve(entry.target); }
  }), { rootMargin: '600px' });
  sections.forEach(section => observer.observe(section));
  const prepareLink = event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) warm(document.getElementById(link.hash.slice(1)));
  };
  ['pointerover', 'focusin', 'click'].forEach(type => document.addEventListener(type, prepareLink, { passive: true }));
  const layers = document.querySelector('.layers-v2');
  const visibility = new IntersectionObserver(([entry]) => layers?.classList.toggle('is-visible', entry.isIntersecting));
  if (layers) visibility.observe(layers);
  return () => {
    observer.disconnect(); visibility.disconnect();
    ['pointerover', 'focusin', 'click'].forEach(type => document.removeEventListener(type, prepareLink));
  };
}
