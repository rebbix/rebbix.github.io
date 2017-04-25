function initIFrame(card, thumbnail) {
  var iframe = document.createElement('iframe')
  iframe.setAttribute('width', '100%')
  iframe.setAttribute('height', '300px')
  iframe.setAttribute('src', card.dataset.videoembed)
  card.querySelector('.card__content').insertBefore(iframe, card.querySelector('.card__label'));
  iframe.addEventListener('load', function() {
    card.dataset.loaded = true;
  });
  thumbnail.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    var cards = document.querySelectorAll('.card.card_embed');
    if (!cards.forEach) {
      cards = Array.from(cards);
    }
    cards.forEach((card, index) => {
      var cardWidth = card.dataset.videoembed ? 47 : Math.floor(Math.random() * 20 + 25);
      var cardMargin = Math.floor(Math.random() * (47 - cardWidth));
      var cardMarginBottom = 20
      var cardMarginTop = index > 1 ? -0 : 15;

      var cardSide = (index % 2) ? 'card_right' : 'card_left';
      card.classList.add(cardSide);
      
      if (card.className.indexOf('card_left') > -1) {
        card.style.marginLeft = cardMargin + '%';
      } else if (card.className.indexOf('card_right')) {
        card.style.marginRight = cardMargin + '%';
      }

      card.style.width = cardWidth + '%';
      card.style.marginBottom = cardMarginBottom + '%';
      card.style.marginTop = cardMarginTop + '%';

      var thumbnail = card.querySelector('.card_embed__thumb');
      if (thumbnail !== null) {
        thumbnail.addEventListener('click', initIFrame.bind(null, card, thumbnail));
      }
    });
});
