import { i as getReact, t as getClient } from './generated/runtime/framework-D_rUT4EX.js';
import Experience from './generated/runtime/Experience-CUGgApuT.js';
import { releaseStartupControls } from './main.js';

export function hydrate() {
  // Same React version as SSR. Navigation remains native throughout startup.
  getClient().hydrateRoot(document.getElementById('app'), getReact().createElement(Experience));
  releaseStartupControls();
}
