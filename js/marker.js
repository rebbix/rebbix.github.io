(function() {
  const HEADER_HEIGHT = 60;

  var url = window.location.pathname;
  var hideMarkers = ['/approach', '/contacts'].indexOf(url) > -1;
  var reverseMarkers = ['/team'].indexOf(url) === -1;
  var replaceLatestYear = url == '/';

  if (!hideMarkers) {
    var $cards = document.querySelectorAll('[data-year]');
    var cardsArray = [].slice.call($cards);
    var coordsAnchors = getAnchorsCoordinates();

    var $marker = document.createElement('div');
    var $markers = [];

    $marker.classList.add('marker');

    var years = coordsAnchors.map(function(anchor) {
      return parseInt(anchor.year);
    });

    var maxYear = Math.max.apply(null, years);

    coordsAnchors.forEach(function (anchor) {
      var $markerItem = document.createElement('div');
      $markerItem.classList.add('marker__item');
      $markerItem.innerHTML = anchor.year;
      $markerItem.dataset.year = anchor.year;
      if (replaceLatestYear && anchor.year == maxYear) {
        $markerItem.innerHTML = 'Now';
      }

      $marker.appendChild($markerItem);
      $markers.push($markerItem);
    });
    document.body.appendChild($marker);

    var coordsMarkers = getMarkersCoordinates();
    arrange()

    window.addEventListener('scroll', function () {
      coordsAnchors = getAnchorsCoordinates();
      arrange();
    });
    window.addEventListener('resize', function () {
      coordsAnchors = getAnchorsCoordinates();
      arrange();
    });

    initMarkerClick();

    function arrange() {
      coordsMarkers.forEach(function (marker, i) {
        var anchor = coordsAnchors.find(function(card) {
          return card.year === marker.year;
        });

        if (!anchor) return;

        const contentTop = i * 35 + HEADER_HEIGHT;
        const initialMarkerTop = marker.top;
        const anchorTop = anchor.top - 30 - document.body.scrollTop;

        if ((anchorTop > contentTop) && (anchorTop < initialMarkerTop)) {
          marker.$marker.classList.add('marker__item_active');
          marker.$marker.classList.remove('marker__item_top');
          marker.$marker.classList.remove('marker__item_top-active');

          marker.$marker.style.top = anchor.top - 30 + 'px';
        } else if (anchorTop < contentTop) {
          marker.$marker.classList.remove('marker__item_active');
          marker.$marker.classList.add('marker__item_top');
          marker.$marker.classList.add('marker__item_top-active');

          if (
              marker.$marker.nextSibling &&
              (marker.$marker.nextSibling.classList.contains('marker__item_top') ||
              marker.$marker.nextSibling.classList.contains('marker__item_active'))
          ) {
            marker.$marker.classList.remove('marker__item_top-active');
          }

        } else {
          marker.$marker.classList.remove('marker__item_active');
          marker.$marker.classList.remove('marker__item_top-active');
          marker.$marker.style.top = '100%';
        }
      })
    }

    function getAnchorsCoordinates() {
      var coords = {};

      for (var i = 0; i < $cards.length; i++) {
        var year = $cards[i].dataset.year;

        if (coords[year]) continue;

        var rect = $cards[i]
          .getBoundingClientRect();

        coords[year] = {
          top: rect.top + document.body.scrollTop,
          year: year
        }
      }

      var anchorsCoords = Object.keys(coords).map(function (i) {
        return coords[i];
      })

      if (reverseMarkers) {
        anchorsCoords = anchorsCoords.reverse();
      }

      return anchorsCoords;
    }

    function getMarkersCoordinates() {
      var coords = [];
      for (var i = 0; i < $markers.length; i++) {
        var $marker = $markers[i];
        var year = $marker.dataset.year;
        var rect = $marker.getBoundingClientRect();

        coords.push({
          $marker: $marker,
          top: rect.top,
          year: year,
        })
      }

      return coords;
    }

    function initMarkerClick() {
      coordsMarkers.forEach(function (marker) {
        marker.$marker.addEventListener('click', function () {
          var anchor = cardsArray.find(function (card) {
            return card.dataset.year === marker.year;
          });

          var anchorTop = anchor.querySelector('.card__wrap').getBoundingClientRect().top;
          var top = anchorTop + document.body.scrollTop;

          scrollTo(document.body, top - HEADER_HEIGHT, 500); // 60 - header height
          window.scrollTo(top - HEADER_HEIGHT); // hack to fire scroll event
        })
      })
    }
  }
})();