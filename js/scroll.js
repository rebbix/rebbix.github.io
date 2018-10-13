// eslint-disable-next-line no-unused-vars
function RB_Scroll() {
  const requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

  const {
    SCROLL_RATIO,
    SCROLL_ON_LOAD,
  } = (window.SHARED || {});

  let scrollTriggered = false;
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
      scrollTriggered = false;
      document.body.style.pointerEvents = '';
    }
  };

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollTo += e.deltaY;

    if (scrollTriggered === false) {
      scrollTriggered = true;
      document.body.style.pointerEvents = 'none';
    }

    if (scrolling === false) {
      scrolling = true;
      requestAnimationFrame(imitateScroll);
    }
  });

  return {};
}
