// eslint-disable-next-line no-unused-vars
function RB_Embed() {
  const container = document.getElementById('contentContainer');
  let containerPadding = 0;
  let contentBoxWidth = 0;

  function updateContentDimenstions() {
    containerPadding = parseInt(window.getComputedStyle(container).paddingLeft, 10);
    contentBoxWidth = container.clientWidth - containerPadding * 2;
  }

  updateContentDimenstions();

  const initIFrame = (card, thumbnail) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '300px');
    iframe.setAttribute('src', card.dataset.videoembed);
    card.querySelector('.card__content').insertBefore(iframe, card.querySelector('.card__label'));
    iframe.addEventListener('load', () => {
      // eslint-disable-next-line no-param-reassign
      card.dataset.loaded = true;
    });
    // eslint-disable-next-line no-param-reassign
    thumbnail.style.display = 'none';
  };

  const cards = [];

  Array.from(document.querySelectorAll('.card.card_embed')).forEach((card, index) => {
    const cardWidth = Math.floor((Math.random() * 20) + 25);
    const cardMargin = Math.floor(Math.random() * (47 - cardWidth));
    const cardData = {
      element: card,
      calculatedWidth: cardWidth,
    }

    cards.push(cardData);
    updateHeight(cardData);

    const cardMarginBottom = 20;
    const cardMarginTop = index > 1 ? -0 : 15;

    const cardSide = (index % 2) ? 'card_right' : 'card_left';
    card.classList.add(cardSide);

    /* eslint-disable no-param-reassign */
    if (card.className.indexOf('card_left') > -1) {
      card.style.marginLeft = `${cardMargin}%`;
    } else if (card.className.indexOf('card_right')) {
      card.style.marginRight = `${cardMargin}%`;
    }

    card.style.width = `${cardWidth}%`;
    card.style.marginBottom = `${cardMarginBottom}%`;
    card.style.marginTop = `${cardMarginTop}%`;
    /* eslint-enable no-param-reassign */

    const thumbnail = card.querySelector('.card_embed__thumb');
    if (thumbnail !== null) {
      thumbnail.addEventListener('click', initIFrame.bind(null, card, thumbnail));
    }
  });

  function updateHeight({ element, calculatedWidth }) {
    const mediaElement = element.querySelector('[data-image-width]');

    if (!mediaElement) { return; }

    const mediaWidth = +mediaElement.dataset.imageWidth;
    const mediaHeight = +mediaElement.dataset.imageHeight;


    const renderedWidth = contentBoxWidth * (calculatedWidth / 100);
    const renderedHeight = mediaHeight * (renderedWidth / mediaWidth);

    mediaElement.style.width = '100%';
    mediaElement.style.height = `${renderedHeight}px`;
  }

  function handleResize(cardData) {
    updateContentDimenstions();
    cards.forEach(updateHeight);
  }

  window.postMessage({ type: 'sizesSet' }, window.location.origin || '*');

  return {
    onresize: handleResize,
  }
}
