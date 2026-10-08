// Scroll-driven optics; no wheel interception, scroll locks, or React frame updates.
function LT_motion(conditions = {}) {
  const mobile = !conditions.desktop;
  if (conditions.reduced) return;
  const origin = document.querySelector('.origin-optical');
  if (!origin) return;
  const aperture = { radius: 0 };
  const leaf = origin.querySelector('.origin-leaf');
  const contour = origin.querySelector('.optical-contour');
  const layers = document.querySelector('.layers-sticky');
  const seal = document.querySelector('.explosion-visual');
  const reveal = { radius: 0 };
  let center = { x: 0, y: 0 };
  const measureReveal = () => {
    const frame = layers.getBoundingClientRect();
    const art = seal.getBoundingClientRect();
    center = { x: art.x + art.width / 2 - frame.x, y: art.y + art.height / 2 - frame.y };
  };
  measureReveal();
  const revealLayers = () => {
    // The aperture originates from the actual section-02 stamp, not a duplicate.
    layers.style.clipPath = `circle(${reveal.radius}vmax at ${center.x}px ${center.y}px)`;
    layers.style.pointerEvents = reveal.radius < 30 ? 'none' : '';
  };
  const cx = mobile ? 66 : 70;
  const cy = mobile ? 49 : 46;
  const updateAperture = () => {
    const radius = aperture.radius;
    leaf.style.maskImage = `radial-gradient(circle at ${cx}% ${cy}%, transparent ${Math.max(0, radius - 1)}vmax, #000 ${radius}vmax)`;
    leaf.style.webkitMaskImage = leaf.style.maskImage;
    contour.style.width = contour.style.height = `${radius * 2}vmax`;
  };
  const easedPhase = value => {
    const p = Math.max(0, Math.min(1, value));
    return p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
  };
  // Derive the section mask from scroll progress, including initial deep links
  // and refreshes. Tween callbacks alone can be suppressed on the initial seek.
  const syncMasks = trigger => {
    const time = trigger.progress * 4;
    reveal.radius = easedPhase((time - 2.8) / .95) * 150;
    aperture.radius = easedPhase((time - .08) / 1.5) * 115;
    updateAperture();
    revealLayers();
  };
  updateAperture();
  revealLayers();
  const journey = Si.timeline({ paused: true });
  journey
    .fromTo('.origin-leaf img', { scale: 1, rotation: 0 }, { scale: 1.32, rotation: -3, ease: 'none', duration: 1.25 }, 0)
    .to({}, { duration: 1.5 }, .08)
    .fromTo('.optical-contour', { opacity: 0 }, { opacity: .55, duration: .2 }, .08)
    .to('.optical-contour', { opacity: 0, duration: .3 }, 1.05)
    .fromTo('.origin-dew img', { scale: 1.1 }, { scale: 1.48, transformOrigin: `${cx}% ${cy}%`, duration: 1.8, ease: 'none' }, .1)
    .fromTo('.origin-matter', { clipPath: `circle(0% at ${cx}% ${cy}%)` }, { clipPath: `circle(145% at ${cx}% ${cy}%)`, duration: 1.45, ease: 'power2.inOut' }, 1.35)
    .fromTo('.origin-matter img', { scale: 2.5, rotation: 7 }, { scale: 1, rotation: 0, duration: 1.5, ease: 'power2.out' }, 1.35)
    .to('.origin-line-0', { opacity: 0, duration: .2 }, .65)
    .fromTo('.origin-line-1', { opacity: 0 }, { opacity: 1, duration: .2 }, .85)
    .to('.origin-line-1', { opacity: 0, duration: .2 }, 1.8)
    .fromTo('.origin-line-2', { opacity: 0 }, { opacity: 1, duration: .2 }, 2)
    .to('.origin-matter img', { filter: 'grayscale(1) brightness(1.7)', duration: .65 }, 2.7)
    .to('.origin-content', { opacity: 0, duration: .4 }, 2.8)
    .to({}, { duration: 1.2 }, 2.8);
  // Attach only after the whole journey exists, so an initial deep-link seek
  // sees the final timeline duration and renders the right photographic state.
  Y.create({ animation: journey, trigger: origin, start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true, onUpdate: syncMasks, onRefresh: trigger => { measureReveal(); syncMasks(trigger); } });

  Si.fromTo('.hero-media', { scale: 1.03, rotation: 0 }, { scale: 1.33, rotation: -2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  Si.to('.hero-content', { opacity: 0, y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: '45% top', end: 'bottom top', scrub: .5 } });
  if (conditions.desktop) {
    Si.to('.format-track', { x: () => -Math.max(0, document.querySelector('.format-track').scrollWidth - window.innerWidth), ease: 'none', scrollTrigger: { trigger: '.formats-scene', start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true } });
  }
  Si.fromTo('.format-art', { rotationY: -13, rotationX: 9, scale: .86 }, { rotationY: 0, rotationX: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.formats-scene', start: 'top 80%', end: 'top top', scrub: .8 } });
  Si.fromTo('.light-stage', { clipPath: 'circle(8% at 50% 50%)', scale: .9 }, { clipPath: 'circle(145% at 50% 50%)', scale: 1, ease: 'power2.inOut', scrollTrigger: { trigger: '#luz', start: 'top 80%', end: 'top 12%', scrub: .7 } });
  Si.fromTo('.atlas-seal', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(145% at 50% 50%)', ease: 'power2.inOut', scrollTrigger: { trigger: '.security-atlas', start: 'top 85%', end: 'top 15%', scrub: .55 } });
  Si.fromTo('.trace-heading', { opacity: .3, y: 45 }, { opacity: 1, y: 0, scrollTrigger: { trigger: '#rastro', start: 'top 85%', end: 'top 20%', scrub: .6 } });
  Si.fromTo('.trace-steps li', { opacity: .18, y: 30 }, { opacity: 1, y: 0, stagger: .22, ease: 'none', scrollTrigger: { trigger: '.trace-steps', start: 'top 88%', end: 'top 38%', scrub: .6 } });
  Si.fromTo('.closing picture', { clipPath: 'circle(12% at 75% 45%)', scale: 1.25 }, { clipPath: 'circle(145% at 75% 45%)', scale: 1, ease: 'power2.inOut', scrollTrigger: { trigger: '.closing', start: 'top 85%', end: 'top 10%', scrub: .7 } });
}
