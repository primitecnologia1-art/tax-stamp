// The complete page is already rendered as HTML. Show its first image before
// starting the animation/interaction runtime, so JavaScript cannot delay it.
let initialization;
const initialize = () => initialization ??= import('./hydrate.js').then(module => module.hydrate());
const activateControl = event => {
  const button = event.target.closest('button');
  if (!button || !button.closest('#app')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  initialize().then(() => button.click());
};
document.addEventListener('click', activateControl, true);

const image = document.querySelector('.hero-media img');
const firstPaint = new Promise(resolve => {
  // Paint timing is an optimization, never a prerequisite for the site.
  // Older Safari/WebViews may omit the API or reject the modern observe options.
  if (typeof PerformanceObserver === 'undefined' ||
      !PerformanceObserver.supportedEntryTypes?.includes('paint')) return resolve();
  let observer;
  const finish = () => { observer?.disconnect(); resolve(); };
  const timeout = setTimeout(finish, 1500);
  try {
    if (performance.getEntriesByName('first-contentful-paint').length) {
      clearTimeout(timeout); return finish();
    }
    observer = new PerformanceObserver(list => {
      if (list.getEntries().some(entry => entry.name === 'first-contentful-paint')) {
        clearTimeout(timeout); finish();
      }
    });
    observer.observe({ type: 'paint', buffered: true });
  } catch {
    clearTimeout(timeout); finish();
  }
});
const imageReady = Promise.race([
  typeof image?.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve(),
  new Promise(resolve => setTimeout(resolve, 1200)),
]);
// Start the interaction runtime after the browser presents the first screen.
// Controls and scrolling still activate it immediately if used earlier.
Promise.all([firstPaint, imageReady]).then(() => requestAnimationFrame(initialize));

window.addEventListener('scroll', initialize, { once: true, passive: true });

export function releaseStartupControls() {
  document.removeEventListener('click', activateControl, true);
}
