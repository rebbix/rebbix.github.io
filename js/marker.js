var url = window.location.pathname
var hideMarkers = ['/approach', '/contacts'].indexOf(url) > -1
var reverseMarkers = ['/team'].indexOf(url) === -1
var dynamicMarkers = ['/life'].indexOf(url) > -1
var yearSeparator = ['/life'].indexOf(url) > -1

if (!hideMarkers) {
  var $cards = document.querySelectorAll('.card')
  var cardsArray = [].slice.call($cards)
  var coordsAnchors = getAnchorsCoordinates()

  // if (yearSeparator) addYearSeparator()

  var $marker = document.createElement('div')
  var $markers = []

  $marker.classList.add('marker')

  coordsAnchors.forEach(function (anchor) {
    var $markerItem = document.createElement('div')
    $markerItem.classList.add('marker__item')
    $markerItem.innerHTML = anchor.year
    $marker.appendChild($markerItem)
    $markers.push($markerItem)
  })
  document.body.appendChild($marker)

  var coordsMarkers = getMarkersCoordinates()
  document.addEventListener('DOMContentLoaded', arrange)
  window.addEventListener('scroll', arrange)
  window.addEventListener('resize', function () {
    coordsAnchors = getAnchorsCoordinates()
    arrange()
  })

  if (dynamicMarkers) initContentObserver()
  initMarkerClick()



  function arrange() {
    if (dynamicMarkers) {
      coordsAnchors = getAnchorsCoordinates()
    }

    coordsMarkers.forEach(function (marker, i) {
      var anchor = coordsAnchors.find(function(card) {
        return card.year === marker.year
      })

      if (!anchor) return

      const contentTop = i * 35 + 60
      const initialMarkerTop = marker.top
      const anchorTop = anchor.top - 30 - document.body.scrollTop

      if ((anchorTop > contentTop) && (anchorTop < initialMarkerTop)) {
        marker.$marker.classList.add('marker__item_active')
        marker.$marker.classList.remove('marker__item_top')
        marker.$marker.style.top = anchor.top - 30 + 'px'
      } else if (anchorTop < contentTop) {
        marker.$marker.classList.remove('marker__item_active')
        marker.$marker.classList.add('marker__item_top')
      } else {
        marker.$marker.classList.remove('marker__item_active')
        marker.$marker.style.top = '100%'
      }
    })
  }

  function getAnchorsCoordinates() {
    var coords = {}

    for (var i = 0; i < $cards.length; i++) {
      var year = $cards[i].dataset.year

      if (coords[year]) continue

      var rect = $cards[i]
        .querySelector('.card__wrap')
        .getBoundingClientRect()

      coords[year] = {
        top: rect.top + document.body.scrollTop,
        year: year
      }
    }

    var anchorsCoords = Object.keys(coords).map(function (i) {
      return coords[i]
    })

    if (reverseMarkers) {
      anchorsCoords = anchorsCoords.reverse()
    }

    return anchorsCoords
  }

  function getMarkersCoordinates() {
    var coords = []
    for (var i = 0; i < $markers.length; i++) {
      var $marker = $markers[i]
      var year = $marker.innerHTML
      var rect = $marker.getBoundingClientRect()

      coords.push({
        $marker: $marker,
        top: rect.top,
        year: year,
      })
    }
    return coords
  }

  function initMarkerClick() {
    coordsMarkers.forEach(function (marker) {
      marker.$marker.addEventListener('click', function () {
        var anchor = cardsArray.find(function (card) {
          return card.dataset.year === marker.year
        })

        var anchorTop = anchor.querySelector('.card__wrap').getBoundingClientRect().top
        var top = anchorTop + document.body.scrollTop

        scrollTo(document.body, top - 60, 500) // 60 - header height
        window.scrollTo(top - 60) // hack to fire scroll event
      })
    })
  }

  function initContentObserver() {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function () {
      arrange()
    });

    observer.observe(document.querySelector('.content'), {
      subtree: true,
      childList: true,
    })
  }

  function addYearSeparator() {
    var content = document.querySelector('.content')

    coordsAnchors.forEach(function (anchor) {
      var card = cardsArray.find(function (card) {
        return card.dataset.year === anchor.year
      })

      var separator = document.createElement('div')
      separator.classList.add('card', 'card_year')
      separator.dataset.year = anchor.year
      separator.innerHTML = '<div class="card__wrap">' + anchor.year + '</div>'

      content.insertBefore(separator, card)
    })

    $cards = document.querySelectorAll('.card')
    cardsArray = [].slice.call($cards)
    coordsAnchors = getAnchorsCoordinates()
  }
}