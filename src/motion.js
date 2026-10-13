// Scroll-driven optics; no wheel interception, scroll locks, or React frame updates.
function LT_motion(conditions = {}) {
  const mobile = !conditions.desktop;
  const origin = document.querySelector('.origin-optical');
  if (!origin) return;
  const aperture = { radius: 0 };
  const leaf = origin.querySelector('.origin-leaf');
  const contour = origin.querySelector('.optical-contour');
  const layers = document.querySelector('.layers-sticky');
  const layersScene = document.querySelector('.layers-scene');
  const formatScene = document.querySelector('.formats-scene');
  const formatStage = document.querySelector('.formats-sticky');
  const supportsPath = typeof CSS !== 'undefined' && CSS.supports('clip-path', "path('M 0 0 H 1 V 1 H 0 Z')");
  const revealLayers = progress => {
    // Fine, staggered print lines resolve across one shared field. No aperture
    // is tied to a stamp shape: the same optical process joins both formats.
    const width = layers.offsetWidth;
    const height = layers.offsetHeight;
    const bands = mobile ? 80 : 120;
    const pitch = height / bands;
    const paths = [];
    for (let index = 0; index < bands; index++) {
      const phase = easedPhase(progress * 1.55 - index / bands * .45);
      const half = (pitch + 2) * phase / 2;
      const center = (index + .5) * pitch;
      if (half > 0) paths.push(`M 0 ${center - half} H ${width} V ${center + half} H 0 Z`);
    }
    const path = paths.join(' ') || 'M 0 0 H 0 V 0 Z';
    const clip = progress >= .999 ? 'none' : `path('${path}')`;
    // Use the optical line reveal where supported, a registered inset otherwise.
    const mask = supportsPath ? clip : `inset(${(1 - progress) * 100}% 0 0 0)`;
    layers.style.clipPath = mask;
    layers.style.webkitClipPath = mask;
    layers.style.pointerEvents = progress < .7 ? 'none' : '';
    // Keep the outgoing stamps registered while their sticky section reaches
    // its boundary; the incoming construction remains at the same coordinates.
    Si.set(formatStage, { y: Math.max(0, progress * window.innerHeight * .65 - (window.innerHeight - formatStage.offsetHeight)) });
    formatStage.style.setProperty('--inspection-progress', String(progress));
    formatStage.style.setProperty('--foil-light', `${110 - progress * 145}%`);
    Si.set('.format-art img', { opacity: 1 - easedPhase(progress), rotationX: progress * 12, rotationY: 0, rotationZ: -12, scale: 1 });
    Si.set('.formats-intro, .format-item figcaption', { opacity: 1 - easedPhase(progress / .55) });
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
    const time = trigger.progress * 2.85;
    aperture.radius = easedPhase((time - .08) / 1.5) * 115;
    updateAperture();
  };
  updateAperture();
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
    .fromTo('.origin-line-2', { opacity: 0 }, { opacity: 1, duration: .2 }, 2);
  // Attach only after the whole journey exists, so an initial deep-link seek
  // sees the final timeline duration and renders the right photographic state.
  Y.create({ animation: journey, trigger: origin, start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true, onUpdate: syncMasks, onRefresh: syncMasks });

  // A continuous optical study fills the entire format chapter. The stamps
  // turn under raking light, settle into registration, then resolve into layers.
  const formatImages = [...formatStage.querySelectorAll('.format-art img')];
  const formatStudy = trigger => {
    if (trigger.progress >= 1) return;
    const p = trigger.progress;
    const turn = Math.sin(p * Math.PI);
    formatImages.forEach((image, index) => Si.set(image, {
      rotationY: (index ? -1 : 1) * turn * 27,
      rotationX: turn * 14,
      rotationZ: -12 + (index ? 1 : -1) * turn * 9,
      scale: 1 + turn * .09,
      opacity: 1,
    }));
    formatStage.style.setProperty('--foil-light', `${-35 + p * 145}%`);
  };
  Y.create({ trigger: formatScene, start: 'top 60%', endTrigger: layersScene, end: 'top top', onUpdate: formatStudy, onRefresh: formatStudy, invalidateOnRefresh: true });
  const syncLayerReveal = trigger => revealLayers(trigger.progress);
  Y.create({
    trigger: layersScene,
    start: 'top top',
    end: () => 'top -' + window.innerHeight * .65,
    onUpdate: syncLayerReveal,
    onRefresh: syncLayerReveal,
    invalidateOnRefresh: true,
  });

  // The opening image is painted by CSS, not repainted during hydration.
  // Begin its parallax only when scrolling actually changes its pose.
  const heroMedia = document.querySelector('.hero-media');
  let heroMoved = false;
  const heroPose = trigger => {
    if (!trigger.progress && !heroMoved) return;
    if (!heroMoved) heroMedia.style.willChange = 'transform';
    heroMoved = true;
    Si.set(heroMedia, { scale: 1.03 + trigger.progress * .3, rotation: -trigger.progress * 2 });
  };
  Y.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: heroPose, onRefresh: heroPose });
  Si.to('.hero-content', { opacity: 0, y: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: '45% top', end: 'bottom top', scrub: .5 } });
  Si.fromTo('.light-stage', { clipPath: 'circle(8% at 50% 50%)', scale: .9 }, { clipPath: 'circle(145% at 50% 50%)', scale: 1, ease: 'power2.inOut', scrollTrigger: { trigger: '#luz', start: 'top 80%', end: 'top 12%', scrub: .7 } });
  Si.fromTo('.atlas-seal', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(145% at 50% 50%)', ease: 'power2.inOut', scrollTrigger: { trigger: '.security-atlas', start: 'top 85%', end: 'top 15%', scrub: .55 } });
  Si.fromTo('.trace-heading', { y: 45 }, { y: 0, scrollTrigger: { trigger: '#rastro', start: 'top 85%', end: 'top 20%', scrub: .6 } });
  Si.fromTo('.trace-steps li', { y: 30 }, { y: 0, stagger: .22, ease: 'none', scrollTrigger: { trigger: '.trace-steps', start: 'top 88%', end: 'top 38%', scrub: .6 } });
  Si.fromTo('.closing picture', { clipPath: 'circle(12% at 75% 45%)', scale: 1.25 }, { clipPath: 'circle(145% at 75% 45%)', scale: 1, ease: 'power2.inOut', scrollTrigger: { trigger: '.closing', start: 'top 85%', end: 'top 10%', scrub: .7 } });
}
