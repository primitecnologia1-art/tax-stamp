function rh({ format = 'circle', uv = false, alt, className = '', eager = false, sizes }) {
  return X.jsx('img', { ...LTSealProps(format, uv), ...(sizes ? { sizes } : {}), className, alt,
    loading: eager ? 'eager' : 'lazy', decoding: 'async', draggable: false });
}
