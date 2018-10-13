/**
 * Main file with initialization all shared data and
 * all event listeners
 */

/* SHARED */
// eslint-disable-next-line prefer-const
window.SHARED = {
  MOBILE_BREAK_POINT: 568,
  TABLET_BREAK_POINT: 768,
  STATIC_CONTENT_BREAK_POINT: 1440,
  WINDOW_WIDTH: window.innerWidth,
  WINDOW_HEIGHT: window.innerHeight,
  SCROLL_ON_LOAD: window.scrollY,
  SCROLL_Y: window.scrollY,
  DOCUMENT_HEIGHT: document.body.offsetHeight,
  SCROLL_RATIO: 0.15,
};

/* HELPERS */
/**
 * updateVariables updating all the consts after document loaded
 */
function updateVariables() {
  window.SHARED.DOCUMENT_HEIGHT = document.body.offsetHeight;
  window.SHARED.SCROLL_ON_LOAD = window.scrollY;
  window.SHARED.WINDOW_HEIGHT = window.innerHeight;
  window.SHARED.WINDOW_WIDTH = window.innerWidth;
}

/* INIT THINGS */
/* eslint-disable no-unused-vars */
const scroll = new RB_Scroll();
const hover = new RB_Hover();
const parallax = new RB_Parallax();
const markers = new RB_Markers();
const sticky = new RB_Sticky();
const lazyLoader = new RB_LazyImageLoader();
const embed = new RB_Embed();
const animate = new RB_Animate();
/* eslint-enable no-unused-vars */

const composedScrollListeners = () => {
  window.SHARED.SCROLL_Y = window.scrollY;
  markers.onscroll();
  sticky.onscroll();
  animate.onscroll();
  parallax.onscroll();
};

const composedLoadListeners = () => {
  window.SHARED.SCROLL_Y = window.scrollY;
  markers.onload();
  sticky.onload();
  animate.onload();
  parallax.onload();
  scroll.onload();
};

const composedResizeListeners = () => {
  updateVariables();
  window.SHARED.SCROLL_Y = window.scrollY;
  animate.onresize();
  parallax.onresize();
  embed.onresize();
  markers.onresize();
};

window.addEventListener('scroll', composedScrollListeners, { passive: true });
window.addEventListener('resize', composedResizeListeners);
window.addEventListener('load', composedLoadListeners);
