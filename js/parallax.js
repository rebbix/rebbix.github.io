// eslint-disable-next-line no-unused-vars
function Parallax() {
  const selectors = [
    '.card_right.card_person',
    '.card_right.card_work',
  ];
  const translateRegexp = /translate\(-*\d+.?\d*[a-z]*,\s-*\d+.?\d*[a-z]*\)/;
  const translateValueRegexp = /-*\d+[.\d*]?\w*/g;

  let measurement = 'vw';
  let ratio = 0.01;
  let mobileViewport = false;

  /**
   * Works almost perfectly, except the case, when user reloads the page
   * not at the top of the page
   */

  this.parallaxCards = [];

  const getYTranslation = (transformString = '') => {
    const { WINDOW_WIDTH } = window.SHARED;
    if (transformString.length === 0) { return 0; }

    const [translateString] = transformString.match(translateRegexp) || [];
    if (translateString === undefined) { return 0; }

    // eslint-disable-next-line no-unused-vars
    const [translateX, translateY] = translateString.match(translateValueRegexp) || [];

    const translateYMeasurement = translateY.replace(/\d./g, '');
    const translateYValue = parseFloat(translateY, 10);

    if (translateYMeasurement === 'vw') {
      return translateYValue * (WINDOW_WIDTH / 100);
    } else if (translateYMeasurement === 'px') {
      return translateYValue;
    }
    return 0;
  };

  const getParallaxCardsCoords = () => {
    const { WINDOW_HEIGHT, DOCUMENT_HEIGHT, SCROLL_Y } = window.SHARED;
    const rightCards = document.querySelectorAll(selectors.join(', ')) || [];

    return [].map.call(rightCards, (card) => {
      const { top } = card.getBoundingClientRect();
      const absoluteTop = (top + SCROLL_Y) - getYTranslation(card.style.transform);
      const appearedOn = absoluteTop < WINDOW_HEIGHT
        ? 0
        : (absoluteTop - WINDOW_HEIGHT) / DOCUMENT_HEIGHT;

      return {
        card,
        appearedOn,
      };
    });
  };

  const parallax = () => {
    const {
      SCROLL_Y,
      DOCUMENT_HEIGHT,
    } = window.SHARED;

    if (mobileViewport) { return; }

    this.parallaxCards.forEach(({ card, appearedOn }) => {
      if (card.classList.contains('card_in-view')) {
        const Y = (SCROLL_Y - (DOCUMENT_HEIGHT * appearedOn)) * ratio;
        // eslint-disable-next-line no-param-reassign
        card.style.transform = `translate(0, ${Y}${measurement})`;
      }
    });
  };

  const checkViewportWidth = () => {
    const {
      WINDOW_WIDTH,
      TABLET_BREAK_POINT,
      STATIC_CONTENT_BREAK_POINT,
    } = window.SHARED;

    if (WINDOW_WIDTH <= TABLET_BREAK_POINT) {
      mobileViewport = true;
    } else if (mobileViewport) {
      mobileViewport = false;
    } else if (WINDOW_WIDTH >= STATIC_CONTENT_BREAK_POINT) {
      measurement = 'px';
      ratio = 0.1;
    } else {
      measurement = 'vw';
      ratio = 0.01;
    }

    this.parallaxCards = getParallaxCardsCoords();
    parallax();
  };

  checkViewportWidth();

  return {
    onload: checkViewportWidth,
    onresize: checkViewportWidth,
    onscroll: parallax,
  };
}
