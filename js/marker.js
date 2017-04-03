(function() {
  const HEADER_HEIGHT = 60;
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
          if (isScrolling) { return };
          isScrolling = true;
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

          scrollContentTo(top - HEADER_HEIGHT, SCROLL_DURATION, function() {
            isScrolling = false;
          });
        })
      })
    }

    var tabletViewport = false;
    var TABLET_BREAK_POINT = 768;
    function redrawMarkers() {
      if (tabletViewport) { return }
      coordsAnchors = getAnchorsCoordinates();
      arrange();
    }

    window.addEventListener('scroll', redrawMarkers);
    window.addEventListener('wheel', redrawMarkers);
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


(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();


function easeOutCubic(t) { return  (--t)*t*t+1 };

var canceledByNativeEvent = false;
function scrollContentTo(scrollingDistance, duration, callback) {
  canceledByNativeEvent = false;

  var endOfAnimation = Date.now() + duration;
  var scrollPositionOnStart = parseFloat(document.body.dataset.scrollTop, 10) || 0;
  var scrollPositionOnEnd = scrollPositionOnStart + scrollingDistance
  var scrollDown = scrollPositionOnStart < scrollPositionOnStart + scrollingDistance;
  function scroll(timestamp) {
    var progress = 1 - (endOfAnimation - Date.now()) / duration; // in range [0, 1];
    progress = progress <= 1 ? progress : 1;
    var scrollStep = scrollingDistance * easeOutCubic(progress);
    var nextScrollPositino = scrollPositionOnStart + scrollStep;
    setScrollPosition(nextScrollPositino);

    var notTargetPosition = scrollDown ? nextScrollPositino < scrollPositionOnEnd : scrollPositionOnEnd < nextScrollPositino;
    if (notTargetPosition && !canceledByNativeEvent) {
      requestAnimationFrame(scroll);
    } else {
      scrolled += scrollingDistance;
      scrollTo += scrollingDistance;
      callback && callback();
    }
  }

  requestAnimationFrame(scroll);
}

var content = document.querySelector('.content');
var header = document.querySelector('.header .header__wrap');
var footer = document.querySelector('.footer');
function setScrollPosition(position) {
  var currentBodyScroll = parseFloat(document.body.dataset.scrollTop, 10) || 0;
  content.style.transform = `translate(0, ${-position}px)`;
  header.style.transform = `translate(0, ${-position}px)`;
  document.body.dataset.scrollTop = position;

  window.dispatchEvent(new WheelEvent('wheel', {
    deltaX: 0,
    deltaY: position - currentBodyScroll,
    deltaMode: 0x00
  }));
}

function preventHomeAndEnd(e) {
  var toPrevent = [37, 38, 39, 40];
  var arrows = toPrevent.some(function(keyCode) { return keyCode === e.keyCode; });
  var isHomeEnd = e.keyCode === 35 || e.keyCode === 36;
  if (e.metaKey && arrows || isHomeEnd) {
    e.preventDefault();
  } else if (!e.metaKey && arrows) {
    e.preventDefault();
    var deltaY = 0;
    if (e.keyCode === 38) {
      deltaY = -20;
    } else if (e.keyCode === 40) {
      deltaY = 20;
    }

    window.dispatchEvent(new WheelEvent('wheel', {
      deltaX: 0,
      deltaY: deltaY,
      deltaMode: 0x00
    }));
  }
}

window.addEventListener('keydown', preventHomeAndEnd);
window.addEventListener('keypress', preventHomeAndEnd);
window.addEventListener('keyup', preventHomeAndEnd);

var content = document.querySelector('.content');
var header = document.querySelector('.header .header__wrap');
var footer = document.querySelector('.footer');

var translateRegexp = /translate\(-*\d+.?\d*[a-z]*,\s-*\d+.?\d*[a-z]*\)/;
var translateValueRegexp = /-*\d+[.\d*]?\w*/g;

function getY() {
  var YValue = 0;
  var transformString = content.style.transform;
  if (transformString.length) {

      var translateString = transformString.match(translateRegexp);
      if (translateString === null) {
          return YValue;
      } else {
          translateString = translateString[0];
      }

      var translateValue = translateString.match(translateValueRegexp);
      if (translateValue === null) { return YValue; }
      YValue = parseFloat(translateValue[1], 10);
  }
  return YValue;
}

function setY(y) {
  var transformString = content.style.transform;
  var translateString = transformString.match(translateRegexp);
  if (translateString === null) {
    header.style.transform = 'translate(0, ' + -y + 'px)';
    content.style.transform = 'translate(0, ' + -y + 'px)';  
    document.body.dataset.scrollTop = y;
    return
  } else {
    translateString = translateString[0];
  }
  translateIndex = transformString.indexOf(translateString);
  var translateValue = translateString.match(translateValueRegexp);
  translateValue[1] = -y + 'px';

  var transformStringWithoutTranslate = transformString.slice(0, translateIndex) + transformString.slice(translateIndex + translateString.length);
  var transformStyle = transformStringWithoutTranslate + 'translate(' + translateValue.join(', ') + ')';
  document.body.dataset.scrollTop = y;
  header.style.transform = transformStyle;
  content.style.transform = transformStyle;
  footer.style.transform = transformStyle;
}

function scroll() {
  scrolled += (scrollTo - scrolled) * 0.1;
  
  window.dispatchEvent(new WheelEvent('wheel', {
    deltaX: 0,
    deltaY: (scrollTo - scrolled) * 0.1,
    deltaMode: 0x00
  }));

  setY(scrolled);

  if (Math.abs(scrollTo - scrolled) > 0.1) {
    requestAnimationFrame(scroll);
  } else {
    scrolling = false;
  }
}

var scrollTo = 0;
var scrolled = 0;
var scrolling = false;
var footer = document.querySelector('.footer');
window.addEventListener('wheel', e => {
  e.preventDefault();
  if (!e.isTrusted || isScrolling) return;

  var nextScrollTo  = scrollTo + e.deltaY;

  if (nextScrollTo < 0) {
    nextScrollTo = 0;
    // todo: find out why does page has some extra height?
  } else if (nextScrollTo > 13900) {//document.body.clientHeight) {
    nextScrollTo = 13900;// document.body.clientHeight;
  }
  scrollTo = nextScrollTo;
  if (!scrolling) {
    scrolling = true;
    requestAnimationFrame(scroll);
  }
});
})();
