var coordsCards = []
var $cards = document.querySelectorAll('.card_embed-facebook, .card_embed-youtube, .card_embed-instagram, .card_embed-twitter')
window.addEventListener('scroll', arrange)

window.addEventListener('load', function() {
  var scrollTop = document.body.scrollTop;
  coordsCards = getCardsCoordinates()
  for (var i = 0; i < coordsCards.length; i++) {
    if (coordsCards[i].top >= scrollTop && coordsCards[i].top <= scrollTop + window.innerHeight) {
      if (!$cards[i].dataset.loaded) {
        $cards[i].dataset.loaded = true;
        addPost($cards[i]);
      }
    }
  }
})


window.addEventListener('resize', function() {
  coordsCards = getCardsCoordinates()
  arrange()
})


function arrange() { 
  var scrollTop = document.body.scrollTop;
  var content = document.querySelector('.content').scrollTop;
  for (var i = 0; i < coordsCards.length; i++) {
    if (coordsCards[i].top >= scrollTop && coordsCards[i].top <= scrollTop + window.innerHeight) {
      if (!$cards[i].dataset.loaded) {
        $cards[i].dataset.loaded = true;
        addPost($cards[i]);
      }
    }
  }
}

function getCardsCoordinates() {
  var coords = []
  for (var i = 0; i < $cards.length; i++) {
    var $card = $cards[i]
    var rect = $card.getBoundingClientRect()
    // console.log(rect.top);

    coords.push({
      $card: $card
    , top: rect.top + document.body.scrollTop
    })
  }
  return coords
}

function addPost(card) {

  if(card.className.indexOf('card_embed-instagram') > -1) {

    var blockquote = document.createElement('blockquote')
    blockquote.classList.add('instagram-media')
    blockquote.dataset.instgrmCaptioned = true
    blockquote.dataset.instgrmVersion = 7
    var link = document.createElement('a')
    link.setAttribute('href', card.dataset.embedUrl)
    blockquote.appendChild(link)
    card.querySelector('.card__content').appendChild(blockquote)
    var script = document.createElement('script')
    script.type = 'text/javascript';
    script.src = "//platform.instagram.com/en_US/embeds.js"
    card.querySelector('.card__content').appendChild(script)
    window.instgrm.Embeds.process()
    coordsCards = getCardsCoordinates()
  }

  else if(card.className.indexOf('card_embed-twitter') > -1) {
    var blockquote = document.createElement('blockquote')
    blockquote.classList.add('twitter-tweet')
    blockquote.dataset.lang = "en"
    var link = document.createElement('a')
    link.setAttribute('href', card.dataset.embedUrl)
    blockquote.appendChild(link)
    card.querySelector('.card__content').appendChild(blockquote)
    var script = document.createElement('script')
    script.type = 'text/javascript';
    script.src = "//platform.twitter.com/widgets.js"
    card.querySelector('.card__content').appendChild(script)
    card.addEventListener('load', function (){
      coordsCards = getCardsCoordinates()
    })
    
  }
  else
  {
    var iframe = document.createElement('iframe')
    iframe.setAttribute('width', card.dataset.embedWidth)
    iframe.setAttribute('class' , 'facebook_post')
    iframe.setAttribute('height', card.dataset.embedHeight)
    iframe.setAttribute('src', card.dataset.embedUrl)
    card.querySelector('.card__content').appendChild(iframe)
    iframe.addEventListener('load', function() {
    coordsCards = getCardsCoordinates()
    })
  }
}
