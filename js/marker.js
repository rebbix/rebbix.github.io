var url = window.location.pathname
var hideMarkerUrls = ['/approach', '/contacts'];

if (hideMarkerUrls.indexOf(url) === -1) {
  var $cards = document.querySelectorAll('.card')
  var coordsAnchors = getAnchorsCoordinates()
  var $marker = document.createElement('div')
  var $markers = []

  $marker.classList.add('marker')

  coordsAnchors = coordsAnchors.reverse()
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
    coordsMarkers = getMarkersCoordinates()
    arrange()
  })

  coordsMarkers.forEach(function (marker) {
    marker.$marker.addEventListener('click', function () {
      var anchor = coordsAnchors.find(function (anchor) {
        return anchor.year == marker.year
      })
      scrollTo(document.body, anchor.top - 60, 500)
    })
  })

  function arrange() {
    coordsMarkers.forEach(function (marker, i) {
      coordsAnchors.some(function (anchor) {
        if (marker.year == anchor.year) {

          const contentTop = i * 35 + 60
          const initialMarkerTop = marker.top
          const anchorTop = anchor.top - 30 - document.body.scrollTop
          const markerTop = marker.$marker.getBoundingClientRect().top

          if (anchorTop > contentTop && anchorTop < initialMarkerTop) {
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
        }
      })
    })
  }

  function getAnchorsCoordinates() {
    var coords = {}
    for (var i = 0; i < $cards.length; i++) {
      var year = $cards[i].dataset.year
      var rect = $cards[i]
        .querySelector('.card__wrap')
        .getBoundingClientRect()
      if (coords[year]) {
        continue
      }
      coords[year] = {
        top: rect.top + window.pageYOffset
        , year: year
      }
    }
    return Object.keys(coords).map(function (i) {
      return coords[i]
    })
  }

  function getMarkersCoordinates() {
    var coords = []
    for (var i = 0; i < $markers.length; i++) {
      var $marker = $markers[i]
      var year = $marker.innerHTML
      var rect = $marker.getBoundingClientRect()

      coords.push({
        $marker: $marker
        , top: rect.top
        , year: year
      })
    }
    return coords
  }
}
