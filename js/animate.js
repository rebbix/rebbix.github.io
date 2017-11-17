// eslint-disable-next-line no-unused-vars
function Animate() {
  const {
    MOBILE_BREAK_POINT,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    SCROLL_Y,
    SCROLL_ON_LOAD,
  } = (window.SHARED || {});

  const animationElements = document.querySelectorAll('.card:not(.card_separator)');
  let loaded = false;

  function getCardsCoords() {
    const hiddenCards = [];
    [].forEach.call(animationElements, (card) => {
      const clientRect = card.getBoundingClientRect();
      if (clientRect.top < WINDOW_HEIGHT + SCROLL_ON_LOAD) {
        card.classList.add('card_in-view', 'no-shadow');
      } else {
        hiddenCards.push({
          card,
          top: SCROLL_Y + clientRect.top,
        });
      }
    });
    return hiddenCards;
  }

  function isInView(initialCards) {
    if (!loaded || WINDOW_WIDTH <= MOBILE_BREAK_POINT) {
      return;
    }
    const windowHeight = WINDOW_HEIGHT;
    const animationElementsCount = animationElements.length;

    for (let i = 0; i < animationElementsCount; i += 1) {
      const element = animationElements[i];
      const elementBounds = element.getBoundingClientRect();
      const elementTop = elementBounds.top;
      const appearingHeight = initialCards === true
        ? windowHeight
        : windowHeight - (windowHeight * 0.15);

      const a = element.querySelector('.card__img');

      if (elementTop <= appearingHeight) {
        element.classList.add('card_in-view');
        element.classList.add('no-shadow');
      }

      if (elementTop < appearingHeight * 4.5 && a) {
        a.style.display = 'initial';
      }
    }
  }

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
  const cardsCoords = getCardsCoords();

  const exportedIsInView = isInView.bind(this, false);
  return {
    onscroll: exportedIsInView,
    onresize: exportedIsInView,
  };
}
