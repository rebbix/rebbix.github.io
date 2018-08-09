// eslint-disable-next-line no-unused-vars
function Animate() {
  this.cardsCoords = [];

  const {
    MOBILE_BREAK_POINT,
  } = (window.SHARED || {});

  const animationElements = document.querySelectorAll('.card:not(.card_separator) .card__wrap');

  let loaded = false;

  function getCardsCoords() {
    const {
      WINDOW_HEIGHT,
      SCROLL_Y,
    } = (window.SHARED || {});
    const hiddenCards = [];
    [].forEach.call(animationElements, (card) => {
      const clientRect = card.getBoundingClientRect();
      if (clientRect.top < WINDOW_HEIGHT + SCROLL_Y) {
        card.parentElement.classList.add('card_in-view', 'no-shadow');
      } else {
        hiddenCards.push({
          card,
          top: SCROLL_Y + clientRect.top,
        });
      }
    });
    return hiddenCards;
  }

  const isInView = (initialCards) => {
    const {
      WINDOW_HEIGHT,
      WINDOW_WIDTH,
      SCROLL_Y,
    } = (window.SHARED || {});

    if (!loaded || WINDOW_WIDTH <= MOBILE_BREAK_POINT) {
      return;
    }

    const appearingHeight = initialCards === true
      ? SCROLL_Y + WINDOW_HEIGHT
      : SCROLL_Y + (WINDOW_HEIGHT * 0.85);

      for (let i = 0; i < this.cardsCoords.length; i += 1) {
      const { card, top } = this.cardsCoords[i];

      if (top <= appearingHeight && card.parentElement.classList.contains('card_in-view') === false) {
        card.parentElement.classList.add('card_in-view');
      }
    }
  };

  function fadeIn() {
    const header = document.querySelector('.header');
    if (!header) {
      return;
    }

    if (window.sessionStorage && window.sessionStorage.getItem('rebbix:loaded')) {
      header.classList.add('shown__hard');
    } else {
      header.classList.add('shown');
      if (window.sessionStorage) {
        window.sessionStorage.setItem('rebbix:loaded', true);
      }
    }

    setTimeout(() => {
      loaded = true;
      isInView(true);
    }, 800);
  }

  fadeIn();

  this.cardsCoords = getCardsCoords();

  const updateCardsCoords = () => {
    this.cardsCoords = getCardsCoords();
  };
  return {
    onscroll: isInView,
    onresize: updateCardsCoords,
    onload: updateCardsCoords,
  };
}
