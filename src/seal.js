function rh({ format = 'circle', uv = false, alt, className = '', eager = false }) {
  return X.jsx('img', { ...LTSealProps(format, uv), className, alt,
    loading: eager ? 'eager' : 'lazy', decoding: 'async', draggable: false });
}
