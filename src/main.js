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
Promise.race([
  image?.decode().catch(() => {}),
  new Promise(resolve => setTimeout(resolve, 1200)),
]).then(() => requestAnimationFrame(() => requestAnimationFrame(initialize)));

export function releaseStartupControls() {
  document.removeEventListener('click', activateControl, true);
}
