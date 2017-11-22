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
 * updateConsts updating all the consts after document loaded
 */
function updateConsts() {
  window.SHARED.DOCUMENT_HEIGHT = document.body.offsetHeight;
  window.SHARED.SCROLL_ON_LOAD = window.scrollY;
  window.SHARED.WINDOW_HEIGHT = window.innerHeight;
  window.SHARED.WINDOW_WIDTH = window.innerWidth;
}

/* INIT THINGS */
/* eslint-disable no-unused-vars */
const scroll = new Scroll();
const hover = new Hover();
const embed = new Embed();
/* eslint-enable no-unused-vars */
const parallax = new Parallax();
const markers = new Markers();
const animate = new Animate();

const composedScrollListeners = () => {
  window.SHARED.SCROLL_Y = window.scrollY;
  markers.onscroll();
  animate.onscroll();
  parallax.onscroll();
};

const composedLoadListeners = () => {
  window.SHARED.SCROLL_Y = window.scrollY;
  markers.onload();
  animate.onload();
  parallax.onload();
};

const composedResizeListeners = () => {
  updateConsts();
  window.SHARED.SCROLL_Y = window.scrollY;
  markers.onresize();
  animate.onresize();
  parallax.onresize();
};

window.addEventListener('scroll', composedScrollListeners);
window.addEventListener('resize', composedResizeListeners);
window.addEventListener('load', composedLoadListeners);
