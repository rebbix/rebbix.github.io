// eslint-disable-next-line no-unused-vars
function Markers() {
  /* INITIAL-DATA */
  const URL = window.location.pathname;
  const HIDE_MARKERS = ['/contacts'].indexOf(URL) > -1;
  const REPLACE_LATEST_YAER = URL === '/';
  const HIDE_LAST_MARKER = URL === '/';

  /* CONSTS */
  const HEADER_HEIGHT = 60;
  const MARKER_HEIGHT = 35;

  /**
   * Broadcast scroll position for lazy loader
   * @param {Number} progress
   * @param {String} year
   */
  function broadcaseMarkerScrollPosition(progress, year) {
    window.postMessage(
      { type: 'scrollProgress', progress, year },
      window.location.origin || "*"
    );
  }

  /**
   * getAnchorsCoordinates finds coords of the start of each year
   * @argument {Array} - array with DOM elements of cards
   * @return {Array} - with type { card: DOMElement, year: string, top: number }
   */
  function getAnchorsCoordinates(cards) {
    const { SCROLL_Y } = (window.SHARED || {});

    const coordsArray = [];
    const yearsFound = [];

    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      const { year } = card.dataset;
      if (yearsFound.indexOf(year) === -1) {
        yearsFound.push(year);
        coordsArray.push({
          card,
          year,
          top: card.getBoundingClientRect().top + SCROLL_Y,
        });
      }
    }

    return coordsArray;
  }

  function onMarkerClick(top) {
    window.scroll({
      top,
      left: 0,
      behavior: 'smooth',
    });
  }

  function initMarkerListeners($markers, anchors) {
    Object.keys($markers).forEach((year) => {
      const $marker = $markers[year];
      const isFirstMarker = $marker.parentElement.firstElementChild === $marker;
      const yearAnchor = anchors.find(anchor => anchor.year === year);
      // use onclick to prevent multiple listeners
      $marker.onclick = onMarkerClick.bind(
        $marker,
        (isFirstMarker ? 0 : yearAnchor.top - HEADER_HEIGHT),
      );
    });
  }


  /**
   * generateMarkers generate DOM Elements with single marker
   * @argument {Array} of years
   * @argument {DOMElement} of markers containers
   * @return {Array} of DOM Elements markers
   */
  function generateMarkers(years, container, maxYear) {
    return (
      years
        .map((year) => {
          const pureMarker = document.createElement('DIV');

          pureMarker.innerText = (year === maxYear && REPLACE_LATEST_YAER) ? 'Now' : year;
          pureMarker.classList.add('marker__item');
          pureMarker.dataset.year = year;

          container.appendChild(pureMarker);
          return { elem: pureMarker, year };
        })
        .reduce((prev, curr) => Object.assign({}, prev, {
          [curr.year]: curr.elem,
        }), {})
    );
  }

  /**
   * getProgress calculate progress of the namber on number line range
   * @param {Number} curr step in progression
   * @param {Number} end of progression
   * @return {Number} in range [1, 0]
   */
  function getProgress(curr, end) {
    const temp = 1 - (Math.abs(curr) / (Math.abs(curr) + end));
    return temp < 0 ? 0 : temp;
  }

  /**
   * Returns difference of Y coord and scrollposition with offset
   * @param {Numbre} yCoord to check position
   * @param {Number} scrollPosition of the body
   * @param {Number} yOffset adding to the scroll position
   */
  function getViewRelatedPosition(yCoord, scrollPosition, yOffset) {
    return yCoord - (scrollPosition + yOffset);
  }

  /**
   * arrange makrers on the timeline
   * @param {Array} anchors of first card of the year
   * @param {Object} markers of DOM Elements
   */
  const arrange = (anchors, $markers) => {
    const {
      DOCUMENT_HEIGHT,
      SCROLL_Y,
      WINDOW_HEIGHT,
      WINDOW_WIDTH,
      MOBILE_BREAK_POINT,
    } = (window.SHARED || {});


    const markersCount = anchors.length;
    const scrollPosition = SCROLL_Y;
    const windowHeight = WINDOW_HEIGHT;
    const isDesktopScreen = WINDOW_WIDTH > MOBILE_BREAK_POINT;
    let lineHeight = windowHeight - HEADER_HEIGHT - (markersCount * MARKER_HEIGHT);
    lineHeight += (HIDE_LAST_MARKER ? MARKER_HEIGHT : 0);
    let nextActiveYear = null;
    let currentActiveYear = null;

    anchors.forEach((anchor, index) => {
      const nextAnchor = anchors[index + 1] || null;

      const $marker = $markers[anchor.year];
      const markersLeft = markersCount - index;

      if ($marker.classList.contains('marker__item_active')) {
        currentActiveYear = anchor.year;
      }

      const currentAnchorPosition = getViewRelatedPosition(
        anchor.top,
        scrollPosition,
        windowHeight - (markersLeft * MARKER_HEIGHT),
      );

      if (currentAnchorPosition > 0) {
        $marker.style.transform = isDesktopScreen ? `translateY(${lineHeight}px)` : '';
        return;
      }

      const nextAnchorPosition = nextAnchor
        ? getViewRelatedPosition(
            nextAnchor.top,
            scrollPosition,
            windowHeight - (markersLeft * MARKER_HEIGHT),
          )
        : DOCUMENT_HEIGHT - scrollPosition - windowHeight;

      const progress = getProgress(currentAnchorPosition, nextAnchorPosition);
      if (progress !== 0) {
        nextActiveYear = anchor.year;
        broadcaseMarkerScrollPosition(progress, anchor.year);
      }
      $marker.style.transform = isDesktopScreen ? `translateY(${lineHeight * progress}px)` : '';
    });

    if (currentActiveYear !== null && nextActiveYear !== null) {
      $markers[currentActiveYear].classList.remove('marker__item_active');
    }
    if (nextActiveYear !== null) {
      $markers[nextActiveYear].classList.add('marker__item_active');
    }
  };

  /* INITIALIZATION */

  let doNothing = () => {}
  if (HIDE_MARKERS === true) {
    return {
      init: doNothing,
      onload: doNothing,
      onscroll: doNothing,
      onresize: doNothing,
    }
  }

  const $cards = document.querySelectorAll('[data-year]');

  this.coordsAnchors = getAnchorsCoordinates($cards); // coords with first card of the year
  const years = this.coordsAnchors.map(anchor => parseInt(anchor.year, 10));
  const maxYear = Math.max.apply(null, years);

  const $markerContainer = document.createElement('div');
  const $markers = generateMarkers(years, $markerContainer, maxYear);

  $markerContainer.classList.add('marker');

  document.body.appendChild($markerContainer);

  const init = () => {
    this.coordsAnchors = getAnchorsCoordinates($cards);
    initMarkerListeners($markers, this.coordsAnchors);
    arrange(this.coordsAnchors, $markers);
  };

  init();

  const exportedArranger = () => arrange(this.coordsAnchors, $markers);
  const exportedInit = () => init();
  // eslint-disable-next-line consistent-return
  return {
    init: exportedInit,
    onload: exportedInit,
    onscroll: exportedArranger,
    onresize: exportedInit,
  };
}
