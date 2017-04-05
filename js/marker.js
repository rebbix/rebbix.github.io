(function init() {
  var HEADER_HEIGHT = 60;
  var SCROLL_DURATION = 2000;
  var isScrolling = false;

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

    function arrange(byScroll) {
      var shouldBeActive = null;
      coordsMarkers.forEach(function (marker, i) {
        var anchor = coordsAnchors.find(function(card) {
          return card.year === marker.year;
        });
        var nextMarker = coordsMarkers[i + 1]; 
        var scrollPosition = byScroll ? document.body.scrollTop : (+document.body.dataset.scrollTop || 0);
        var nextAnchor = nextMarker ? coordsAnchors.find(function(card) {
          return card.year === nextMarker.year;
        }) : {
          top: document.body.offsetHeight - scrollPosition
        };

        if (!anchor) return;

        var contentTop = i * 35 + HEADER_HEIGHT; // height on top positino
        var initialMarkerTop = marker.top; // top position related to the screen

        var distanceToBottom = window.innerHeight - initialMarkerTop;
        var distanceToTop = contentTop;
        var windowHeight = window.innerHeight;
    
        var yearShown = (windowHeight - anchor.top - (windowHeight - initialMarkerTop));
        var yearHeight = (nextAnchor.top - anchor.top);
        var markerLineHeight = (windowHeight - contentTop - (windowHeight - initialMarkerTop));
        anchorTop = Math.floor(contentTop + markerLineHeight - markerLineHeight * (yearShown / yearHeight));
        if (anchor.year == maxYear && replaceLatestYear) {
          anchorTop = anchor.top;
        }

        marker.$marker.classList.remove('marker__item_active');
        marker.$marker.classList.remove('marker__item_top-active');
        marker.$marker.classList.remove('marker__item_movable');

        if ((anchorTop > contentTop) && (anchorTop < initialMarkerTop)) {
          marker.$marker.classList.remove('marker__item_top');
          marker.$marker.classList.add('marker__item_movable');
          marker.$marker.style.top = anchorTop + 'px';
          if (shouldBeActive === null || marker.year == maxYear) {
            shouldBeActive = marker.$marker;
          }
        } else if (anchorTop <= contentTop) {
          marker.$marker.classList.add('marker__item_top');
        } else {
          marker.$marker.classList.remove('marker__item_top');
          marker.$marker.style.top = '100%';
        }
      });

      if (shouldBeActive !== null) {
        shouldBeActive.classList.add('marker__item_active');
      } else {
        coordsMarkers[coordsMarkers.length - 1].$marker.classList.add('marker__item_top-active');
      }
    }

    function getAnchorsCoordinates() {
      var coords = {};

      for (var i = 0; i < $cards.length; i++) {
        var year = $cards[i].dataset.year;

        if (coords[year]) continue;

        var rect = $cards[i].getBoundingClientRect();

        coords[year] = {
          top: rect.top,
          year: year
        }
      }

      var anchorsCoords = Object.keys(coords).map(function (i) {
        return coords[i];
      });

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

    var isMobileRegex = /[mM]obile/g;
    var isChrome = /[cC]hrome/g;
    // hack to prevent wheeling on mobile chrome
    var isMobileChrome = !!(window.chrome && navigator.userAgent.match(isChrome) && navigator.userAgent.match(isMobileRegex));
    function markerItemClickListener(marker) {
      if (isScrolling) { return };
      isScrolling = true;
      var anchor = coordsAnchors.find(function (card) {
        return card.year === marker.year;
      });

      var anchorTop = anchor ? anchor.top : 0;
      var scrollPosition = isMobileChrome ? document.body.scrollTop : (document.body.dataset.scrollTop || 0);
      // on max year or 'now' marker click - scroll to top of the page
      if (anchor.year == maxYear && replaceLatestYear) {
        anchorTop = scrollPosition * -1;
      }

      // ScrollManager is in another file ./scroll.js
      if (window.ScrollManager) {
        window.ScrollManager.scrollContentTo(anchorTop - HEADER_HEIGHT, SCROLL_DURATION, function() {
          isScrolling = false;
        }, isMobileChrome);
      }
    }

    function initMarkerClick() {
      coordsMarkers.forEach(function (marker) {
        marker.$marker.addEventListener('click', markerItemClickListener.bind(null, marker));
      });
    }

    function redrawMarkers(e) {
      coordsAnchors = getAnchorsCoordinates();
      arrange(e.type === 'scroll');
    }

    window.addEventListener('scroll', redrawMarkers);
    window.addEventListener('wheel', redrawMarkers);
    window.addEventListener('resize', clear);
  }

  function clear() {
    window.removeEventListener('scroll', redrawMarkers);
    window.removeEventListener('wheel', redrawMarkers);
    window.removeEventListener('resize', clear);
    document.body.removeChild($marker);
    init();
  }
})();
