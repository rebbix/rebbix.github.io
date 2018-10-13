function RB_LazyImageLoader() {
  const loadedYears = new Set();
  const cardsPerYears = new Map();
  let years = [];
  let sizesSet = false;

  function scrollProgressListener(event) {
    const { data, origin } = event;

    if (
      (origin !== window.location.origin && origin !== '*')
      || !sizesSet
      || !data
      || data.type !== 'scrollProgress'
    ) { return; }
    const { progress, year } = data;



    const nextYearToLoad = years[years.indexOf(year) + 1];
    const prevYearToLoad = years[years.indexOf(year) - 1];

    loadImagesForYear(year);

    // If there is less than 40% until the end of the year section
    if (prevYearToLoad) {
      loadImagesForYear(prevYearToLoad);
    }

    if (nextYearToLoad) {
      loadImagesForYear(nextYearToLoad);
    }
  }

  function sizeSetListener(event) {
    sizesSet = true;
    console.log({ sizesSet });
  }

  function messageHandler(event) {
    if (!event.data) { return; }

    switch (event.data.type) {
      case 'scrollProgress':
        scrollProgressListener(event);
        break;
      case 'sizesSet':
        sizeSetListener(event);
        break;
      default: break;
    }
  }

  function loadImagesForYear(year) {
    if (loadedYears.has(year)) { return; }
    loadedYears.add(year);

    (cardsPerYears.get(year) || []).forEach(card => {
      const mediaElement = card.querySelector('[data-src]');
      if (!mediaElement) { return; }

      mediaElement.setAttribute('src', mediaElement.dataset.src);
    });
  }

  function init() {
    Array
      .from(document.querySelectorAll('.card[data-year]'))
      .forEach(card => {
        const year = card.dataset.year;
        if (cardsPerYears.has(year)) {
          cardsPerYears.set(year, cardsPerYears.get(year).concat(card));
          return;
        }

        cardsPerYears.set(year, [card]);
      });

    years = Array.from(cardsPerYears.keys());

    window.addEventListener('message', messageHandler);
  }

  if (window.location.pathname.indexOf('/life') !== -1) {
    init();
  }
}