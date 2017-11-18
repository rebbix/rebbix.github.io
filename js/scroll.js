// eslint-disable-next-line no-unused-vars
function Scroll() {
  const requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

  const {
    SCROLL_RATIO,
    SCROLL_ON_LOAD,
  } = (window.SHARED || {});

  let scrolling = false;
  let scrolled = SCROLL_ON_LOAD;
  let scrollTo = SCROLL_ON_LOAD;

  const imitateScroll = () => {
    const delta = parseFloat(((scrollTo - scrolled) * SCROLL_RATIO).toFixed(3));
    scrolled += delta;
    window.scrollBy({
      top: delta,
      left: 0,
    });

    if (Math.round(scrolled) !== scrollTo) {
      requestAnimationFrame(imitateScroll);
    } else {
      scrolling = false;
    }
  };

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollTo += e.deltaY;

    if (scrolling === false) {
      scrolling = true;
      requestAnimationFrame(imitateScroll);
    }
  });

  return {};
}
