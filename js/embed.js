// eslint-disable-next-line no-unused-vars
function Embed() {
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

  let cards = document.querySelectorAll('.card.card_embed');
  if (!cards.forEach) {
    cards = Array.from(cards);
  }
  cards.forEach((card, index) => {
    const cardWidth = card.dataset.videoembed ? 47 : Math.floor((Math.random() * 20) + 25);
    const cardMargin = Math.floor(Math.random() * (47 - cardWidth));
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
}
