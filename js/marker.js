// (function() {
  const HEADER_HEIGHT = 60;

  var url = window.location.pathname;
  var hideMarkers = ['/approach', '/contacts'].indexOf(url) > -1;
  var reverseMarkers = ['/team'].indexOf(url) === -1;
  var replaceLatestYear = url === '/';

  if (!hideMarkers) {
    // when we don't need 'now' marker we sholdn't search for all elements with data-year attr,
    // sometimes h1 also can has a data-year attribute
    var $cards = document.querySelectorAll(replaceLatestYear ? '[data-year]' : '.card[data-year]');
    var cardsArray = [].slice.call($cards);
    var coordsAnchors = getAnchorsCoordinates();

    var $marker = document.createElement('div');
    var $markers = [];

    $marker.classList.add('marker');
    var $markerItemContainer = document.createElement('DIV');
    $markerItemContainer.classList.add('marker_container');
    $marker.appendChild($markerItemContainer);

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

      $markerItemContainer.appendChild($markerItem);
      $markers.push($markerItem);
    });
    document.body.appendChild($marker);

    var coordsMarkers = getMarkersCoordinates();
    arrange()

    initMarkerClick();

    function arrange() {
      coordsMarkers.forEach(function (marker, i) {
        var anchor = coordsAnchors.find(function(card) {
          return card.year === marker.year;
        });
        var nextMarker = coordsMarkers[i + 1]; 
        var nextAnchor = nextMarker ? coordsAnchors.find(function(card) {
          return card.year === nextMarker.year;
        }) : {
          top: document.body.getBoundingClientRect().height
        };

        if (!anchor) return;

        var contentTop = i * 35 + HEADER_HEIGHT; // hight on top positino
        var initialMarkerTop = marker.top; // top position related to the screen

        var distanceToBottom = window.innerHeight - initialMarkerTop;
        var distanceToTop = contentTop;
        var windowHeight = window.innerHeight;
    
        var b = 0;
        var yearShown = (windowHeight - (anchor.top - document.body.scrollTop) - (windowHeight - initialMarkerTop));
        var yearHeight = (nextAnchor.top - anchor.top);
        var markerLineHeight = (windowHeight - contentTop - (windowHeight - initialMarkerTop));
        anchorTop = Math.floor(contentTop + markerLineHeight - markerLineHeight * (yearShown / yearHeight));

        if ((anchorTop > contentTop) && (anchorTop < initialMarkerTop)) {
          marker.$marker.classList.add('marker__item_active');
          marker.$marker.classList.remove('marker__item_top');
          marker.$marker.classList.remove('marker__item_top-active');

          marker.$marker.style.top = anchorTop + 'px';

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

        var rect = $cards[i].getBoundingClientRect();

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
        });
      }

      return coords;
    }

    function initMarkerClick() {
      coordsMarkers.forEach(function (marker) {
        marker.$marker.addEventListener('click', function () {
          var anchor = cardsArray.find(function (card) {
            return card.dataset.year === marker.year;
          });

          var cardWrap = anchor.tagName !== 'H1' ? anchor.querySelector('.card__wrap') : anchor;
          var anchorTop = cardWrap.getBoundingClientRect().top;
          
          // on max year or 'now' marker click - scroll to top of the page
          if (anchor.dataset.year == maxYear && replaceLatestYear) {
            anchorTop = document.body.scrollTop * -1;
          }
          var top = anchorTop + document.body.scrollTop;

          scrollTo(document.body, top - HEADER_HEIGHT, 500); // 60 - header height
          window.scrollTo(top - HEADER_HEIGHT); // hack to fire scroll event
        })
      })
    }

    var tabletViewport = false;
    var TABLET_BREAK_POINT = 768;
    window.addEventListener('scroll', function () {
      if (tabletViewport) { return }
      coordsAnchors = getAnchorsCoordinates();
      arrange();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth <= TABLET_BREAK_POINT) {
        tabletViewport = true;
      } else if (tabletViewport) {
        tabletViewport = false;
        coordsMarkers = getMarkersCoordinates();
      }
      coordsAnchors = getAnchorsCoordinates();
      arrange();
    });
    window.addEventListener('load', function() {
      tabletViewport = window.innerWidth <= TABLET_BREAK_POINT;
    });
  }
// })();