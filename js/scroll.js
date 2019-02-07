// eslint-disable-next-line no-unused-vars
function RB_Scroll() {
  const requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

  const {
    SCROLL_RATIO,
    SCROLL_ON_LOAD,
    SCROLL_Y
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

    if (scrolled > 0 && Math.round(scrolled) !== Math.round(scrollTo)) {
      requestAnimationFrame(imitateScroll);
    } else {
      scrolling = false;
      scrolled = scrollTo = window.scrollY;
      scrollTriggered = false;
      document.body.style.pointerEvents = '';
    }
  };

  const performScroll = () => {
    if (scrollTriggered === false) {
      scrollTriggered = true;
      document.body.style.pointerEvents = 'none';
    }

    if (scrolling === false) {
      scrolling = true;
      requestAnimationFrame(imitateScroll);
    }
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollTo += e.deltaY;

    performScroll();
  });

  onload = () => {
    const scrollHintNode = document.getElementById('headerScrollHint');
    const contentNode = document.getElementById('contentContainer');
    const logoNode = document.getElementById('headerLogo');
    scrollHintNode && contentNode && scrollHintNode.addEventListener('click', () => {
      scrollTo = contentNode.offsetTop;
      // debugger;
      performScroll();
    });
    logoNode && logoNode.addEventListener('click', () => {
      scrollTo = 0;
      performScroll();
    });
  }

  return {
    onload: onload
  };
}
