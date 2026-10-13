// Company links are centralized here because this component is shared by the header and footer.
function sh({ footer: e = false }) {
  return (0, X.jsxs)(`div`, {
    className: `brand ${e ? `brand-footer` : `brand-header`}`,
    "aria-label": `PRIMI e BP Security`,
    children: [
      (0, X.jsx)(`a`, {
        className: `brand-company-link`,
        href: `https://primi.com.br/`,
        target: `_blank`,
        rel: `noopener noreferrer`,
        "aria-label": `Visitar o site da PRIMI`,
        children: (0, X.jsx)(`img`, { className: `primi-logo`, src: LT_ASSETS.logos.primi, width: `560`, height: `153`, alt: `PRIMI` }),
      }),
      (0, X.jsx)(`span`, { className: `brand-divider`, "aria-hidden": `true` }),
      (0, X.jsx)(`a`, {
        className: `brand-company-link`,
        href: `https://www.bpsec.com.br/`,
        target: `_blank`,
        rel: `noopener noreferrer`,
        "aria-label": `Visitar o site da BP Security`,
        children: (0, X.jsx)(`img`, { className: `bp-logo`, src: LT_ASSETS.logos.bp, width: `700`, height: `89`, alt: `BP Security` }),
      }),
    ],
  });
}
