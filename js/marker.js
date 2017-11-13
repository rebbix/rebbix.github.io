/* eslint-disable */
// (function init() {
//   var HEADER_HEIGHT = 60;
//   var SCROLL_DURATION = 2000;
//   var isScrolling = false;

//   var url = window.location.pathname;
//   var hideMarkers = ['/approach', '/contacts'].indexOf(url) > -1;
//   var reverseMarkers = ['/team'].indexOf(url) === -1;
//   var replaceLatestYear = url === '/';

//   if (!hideMarkers) {
//     // when we don't need 'now' marker we sholdn't search for all elements with data-year attr,
//     // sometimes h1 also can has a data-year attribute

//     coordsAnchors.forEach(function (anchor) {
//       var $markerItem = document.createElement('div');
//       $markerItem.classList.add('marker__item');
//       $markerItem.innerText = anchor.year;
//       $markerItem.dataset.year = anchor.year;
//       if (replaceLatestYear && anchor.year == maxYear) {
//         $markerItem.innerText = 'Now';
//       }

//       $markerItemContainer.appendChild($markerItem);
//       $markers.push($markerItem);
//     });
//     document.body.appendChild($marker);

//     var coordsMarkers = getMarkersCoordinates();
//     arrange()

//     initMarkerClick();

//     function arrange(byScroll) {
//       var shouldBeActive = null;
//       coordsMarkers.forEach(function (marker, i) {
//         var anchorIndex = coordsAnchors.findIndex(function(card) {
//           return card.year === marker.year;
//         });
        
//         if (anchorIndex === -1) return;
        
//         var anchor = coordsAnchors[anchorIndex];
        
//         var nextMarker = coordsMarkers[i + 1]; 
//         var nextAnchor = nextMarker ? coordsAnchors[anchorIndex + 1] : {
//           top: document.body.offsetHeight - scrollPosition
//         };

//         var scrollPosition = byScroll ? document.body.scrollTop : (+document.body.dataset.scrollTop || 0);

//         var contentTop = i * 35 + HEADER_HEIGHT; // height on top positino
//         var initialMarkerTop = marker.top; // top position related to the screen

//         var windowHeight = window.innerHeight;
//         var distanceToBottom = windowHeight - initialMarkerTop;
//         var distanceToTop = contentTop;
    
//         var yearShown = windowHeight - anchor.top - (windowHeight - initialMarkerTop);
//         var yearHeight = nextAnchor.top - anchor.top;

//         var markerLineHeight = (windowHeight - contentTop - (windowHeight - initialMarkerTop));
        
//         if (anchor.year == maxYear && replaceLatestYear) {
//           anchorTop = anchor.top;
//         } else {
//           anchorTop = Math.floor(contentTop + markerLineHeight - markerLineHeight * (yearShown / yearHeight));
//         }

//         marker.$marker.classList.remove('marker__item_active');
//         marker.$marker.classList.remove('marker__item_top-active');
//         marker.$marker.classList.remove('marker__item_movable');

//         if ((anchorTop > contentTop) && (anchorTop < initialMarkerTop)) {
//           marker.$marker.classList.remove('marker__item_top');
//           marker.$marker.classList.add('marker__item_movable');
//           debugger
//           marker.$marker.style.transform = 'translateY(' + anchorTop + 'px)';
//           if (shouldBeActive === null || marker.year == maxYear) {
//             shouldBeActive = marker.$marker;
//           }
//         } else if (anchorTop <= contentTop) {
//           marker.$marker.classList.add('marker__item_top');
//         } else {
//           marker.$marker.classList.remove('marker__item_top');
//           marker.$marker.style.transform = 'translateY(' + windowHeight + 'px)';
//         }
//       });

//       if (shouldBeActive !== null) {
//         shouldBeActive.classList.add('marker__item_active');
//       } else {
//         coordsMarkers[coordsMarkers.length - 1].$marker.classList.add('marker__item_top-active');
//       }
//     }

//     function getAnchorsCoordinates() {
//       var coords = {};

//       for (var i = 0; i < $cards.length; i++) {
//         var year = $cards[i].dataset.year;

//         if (coords[year]) continue;

//         var rect = $cards[i].getBoundingClientRect();

//         coords[year] = {
//           top: rect.top,
//           year: year
//         }
//       }

//       var anchorsCoords = Object.keys(coords).map(function (i) {
//         return coords[i];
//       });

//       if (reverseMarkers) {
//         anchorsCoords = anchorsCoords.reverse();
//       }

//       return anchorsCoords;
//     }

//     function getMarkersCoordinates() {
//       var coords = [];
//       for (var i = 0; i < $markers.length; i++) {
//         var $marker = $markers[i];
//         var year = $marker.dataset.year;
//         var rect = $marker.getBoundingClientRect();

//         coords.push({
//           $marker: $marker,
//           top: rect.top,
//           year: year,
//         });
//       }

//       return coords;
//     }

//     var isMobileRegex = /[mM]obile/g;
//     // hack to prevent wheeling on mobile chrome
//     var isMobileBrowser = !!navigator.userAgent.match(isMobileRegex);
//     function markerItemClickListener(marker) {
//       if (isScrolling) { return };
//       isScrolling = true;
//       var anchor = coordsAnchors.find(function (card) {
//         return card.year === marker.year;
//       });

//       var anchorTop = anchor ? anchor.top : 0;
//       var scrollPosition = isMobileBrowser ? document.body.scrollTop : (document.body.dataset.scrollTop || 0);
//       // on max year or 'now' marker click - scroll to top of the page
//       if (anchor.year == maxYear && replaceLatestYear) {
//         anchorTop = scrollPosition * -1;
//       }

//       // ScrollManager is in another file ./scroll.js
//       if (window.ScrollManager) {
//         window.ScrollManager.scrollContentTo(anchorTop - HEADER_HEIGHT, SCROLL_DURATION, function() {
//           isScrolling = false;
//         }, isMobileBrowser);
//       }
//     }

//     function initMarkerClick() {
//       coordsMarkers.forEach(function (marker) {
//         marker.$marker.addEventListener('click', markerItemClickListener.bind(null, marker));
//       });
//     }

//     function redrawMarkers(e) {
//       coordsAnchors = getAnchorsCoordinates();
//       requestAnimationFrame(arrange.bind(this, e.type === 'scroll'));
//     }

//     window.addEventListener('scroll', redrawMarkers);
//     window.addEventListener('wheel', redrawMarkers);
//     window.addEventListener('resize', clear);
//   }

//   function clear() {
//     window.removeEventListener('scroll', redrawMarkers);
//     window.removeEventListener('wheel', redrawMarkers);
//     window.removeEventListener('resize', clear);
//     document.body.removeChild($marker);
//     init();
//   }
// })();
/* eslint-enable */

(function() {
  /* CONSTS */
  var HEADER_HEIGHT = 60;
  var MARKER_HEIGHT = 35;
  var DOCUMENT_HEIGHT = document.body.offsetHeight;
  var SCROLL_ON_LOAD = window.scrollY;

  /* HELPERS */
  /**
   * getAnchorsCoordinates finds coords of the start of each year
   * @argument {Array} - array with DOM elements of cards
   * @return {Array} - with type { card: DOMElement, year: string, top: number }
   */
  function getAnchorsCoordinates(cards) {
    var coordsArray = [];
    var yearsFound = [];

    for (var i = 0; i < cards.length; i += 1) {
      var card = cards[i];
      var year = card.dataset.year;
      if (yearsFound.indexOf(year) !== -1) { continue; }
      yearsFound.push(year);
      coordsArray.push({
        card: card,
        year: year,
        top: card.getBoundingClientRect().top + SCROLL_ON_LOAD, // TODO: think, how to avoid FSL 
      });
    }

    return coordsArray;
  }

  /**
   * generateMarkers generate DOM Elements with single marker
   * @argument {Array} of years
   * @argument {DOMElement} of markers containers
   * @return {Array} of DOM Elements markers
   */
  function generateMarkers(years, container) {
    return (
      years
        .map(function(year) {
          var pureMarker = document.createElement('DIV');
          pureMarker.innerText = year;
          pureMarker.classList.add('marker__item');
          container.appendChild(pureMarker);
          return { elem: pureMarker, year: year };
        })
        .reduce(function(prev, curr) {
          return Object.assign({}, prev, {
            [curr.year]: curr.elem
          });
        }, {})
    );
  }

  function getViewRelatedPosition(yCoord, scrollPosition, yOffset) {
    return yCoord - (scrollPosition + yOffset);
  }

  /**
   * arrange makrers on the timeline
   * @param {Array} anchors of first card of the year
   * @param {Object} markers of DOM Elements  
   */
  function arrange(anchors, $markers) {
    var markersCount = anchors.length;
    var scrollPosition = window.scrollY;
    var windowHeight = window.innerHeight;
    var lineHeight = windowHeight - (markersCount * MARKER_HEIGHT);// - HEADER_HEIGHT;
    
    anchors.forEach(function(anchor, index) {
      var nextAnchor = anchors[index + 1] || null;
      
      var $marker = $markers[anchor.year];
      var markersLeft = markersCount - (index + 1);

      var currentAnchorPosition = getViewRelatedPosition(anchor.top, scrollPosition, windowHeight - (markersLeft * MARKER_HEIGHT));
      
      if (currentAnchorPosition > 0) {
        $marker.style.transform = 'translateY(' + lineHeight + 'px)';
        return;
      }

      var nextAnchorPosition = nextAnchor
        ? getViewRelatedPosition(nextAnchor.top, scrollPosition, windowHeight - ((markersLeft - 1) * MARKER_HEIGHT))
        : DOCUMENT_HEIGHT - scrollPosition - windowHeight;

      var progress = 1 - (Math.abs(currentAnchorPosition) / (Math.abs(currentAnchorPosition) + nextAnchorPosition));
      progress = progress < 0 ? 0 : progress;
      $marker.style.transform = 'translateY(' + lineHeight * progress + 'px)';
    })
  }

  /* INITIALIZATION */

  var $cards = document.querySelectorAll(true ? '[data-year]' : '.card[data-year]');
  var cardsArray = [].slice.call($cards);
  var coordsAnchors = getAnchorsCoordinates($cards); // coords with first card of the year
  var years = coordsAnchors.map(function(anchor) {
    return parseInt(anchor.year, 10);
  });
  var maxYear = Math.max.apply(null, years);

  var $markerContainer = document.createElement('div');
  var $markers = generateMarkers(years, $markerContainer);

  $markerContainer.classList.add('marker');

  document.body.appendChild($markerContainer);

  requestAnimationFrame(arrange.bind(this, coordsAnchors, $markers));

  window.addEventListener('wheel', () => {
    requestAnimationFrame(arrange.bind(this, coordsAnchors, $markers));
  });
})();