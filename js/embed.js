var coordsCards = []
var $cards = document.querySelectorAll('.card_embed-facebook')

window.addEventListener('load', function() {
  coordsCards = getCardsCoordinates()
  if(typeof $cards.dataset !== "undefined") {
    $cards[0].dataset.loaded = true;
    var iframe = document.createElement('iframe')
    iframe.setAttribute('width', $cards[0].dataset.embedWidth)
    iframe.setAttribute('height', $cards[0].dataset.embedHeight)
    iframe.setAttribute('src', $cards[0].dataset.embedUrl)
    $cards[0].querySelector('.card__content').appendChild(iframe)
     iframe.addEventListener('load', function() {
       coordsCards = getCardsCoordinates()
     })
   }    
})

window.addEventListener('scroll', arrange)
window.addEventListener('resize', function() {
  coordsCards = getCardsCoordinates()
  arrange()
})


function arrange() { 
  var scrollTop = document.body.scrollTop;
  var content = document.querySelector('.content').scrollTop;

  for (var i = 0; i < coordsCards.length; i++) {
    if (coordsCards[i].top  >= scrollTop && coordsCards[i].top <= scrollTop + window.innerHeight) {

      if (!$cards[i].dataset.loaded) {
        $cards[i].dataset.loaded = true;
        var iframe = document.createElement('iframe')
        iframe.setAttribute('width', $cards[i].dataset.embedWidth)
        iframe.setAttribute('height', $cards[i].dataset.embedHeight)
        iframe.setAttribute('src', $cards[i].dataset.embedUrl)
        $cards[i].querySelector('.card__content').appendChild(iframe)
        iframe.addEventListener('load', function() {
          coordsCards = getCardsCoordinates()
        })
      }
    }
  }
}

function getCardsCoordinates() {
  var coords = []
  for (var i = 0; i < $cards.length; i++) {
    var $card = $cards[i]
    var rect = $card.getBoundingClientRect()

    coords.push({
      $card: $card
    , top: rect.top + document.body.scrollTop
    })
  }
  return coords
}