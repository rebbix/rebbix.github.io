(function() {
  var animationElements = document.querySelectorAll('.card');
  var visibleOnInitialScreen = [];
  var loaded = false;

  function getRGBColor(hexColor) {
    var rgb = [];
    if (hexColor.indexOf('#') !== 0) {
      return null;
    } else {
      hexColor = hexColor.slice(1);
    }

    if (hexColor.length === 3) { // if it is short hex for of color
      hexColor.split('').forEach(function(char) {
        rgb.push(parseInt(Number('0x' + char.toString()), 10));
      });
    } else if (hexColor.length === 6) { // if full hex form
      var hexChars = hexColor.split('');
      for (var i = 0; i < hexChars.length; i += 2) {
        var hexNumber = Number('0x' + hexChars[i].toString() + hexChars[i + 1].toString());
        rgb.push(parseInt(hexNumber, 10))
      }
    }

    return rgb;
  }

  var MOBILE_BREAK_POINT = 568;
  function isInView(initialCards) {
    if (!loaded || window.innerWidth <= MOBILE_BREAK_POINT) {
      return;
    }
    var windowHeight = window.innerHeight;
    var animationElementsCount = animationElements.length;

    for (var i = 0; i < animationElementsCount; i++) {
      var element = animationElements[i];
      var elementBounds = element.getBoundingClientRect();
      var elementTop = elementBounds.top;
      var appearingHeight = initialCards === true ? windowHeight : windowHeight - windowHeight * 0.15;

      if (elementTop <= appearingHeight) {
        element.classList.add('card_in-view');
        element.classList.add('no-shadow');
      }
    }
  }

  function fadeIn() {
      var header = document.querySelector('.header');
      if (!header) {
          return;
      }

      if (window.sessionStorage && window.sessionStorage.getItem('rebbix:loaded')) {
        header.classList.add('shown__hard');
      } else {
        header.classList.add('shown');
        if (window.sessionStorage) {
          window.sessionStorage.setItem('rebbix:loaded', true);
        }
      }

      setTimeout(function() {
        loaded = true;
        isInView(true);
      }, 800);
  }

  var shadowsApplied = false;
  var SHADOW_OPACITY = '0.4';
  var SHADOW_SIZE = '0px 2vw 7vw 1vw';
  var BRIGHTNESS = 0.5;
  function initShadows() {
    if (shadowsApplied) return;

    var workCards = document.querySelectorAll('.card.card_work:not([class~=card_separator])') || [];

    workCards.forEach(function(card) {
      var wrap = card.querySelector('.card__wrap');
      var shadowColor = wrap.dataset.shadowcolor || '#808080';
      var rgb = getRGBColor(shadowColor).map(function(color) {
        return Math.floor(color * BRIGHTNESS);
      });

      var shadowStyleString = SHADOW_SIZE + ' rgba(' + rgb.join(', ') + ', ' + SHADOW_OPACITY + ')';
      wrap.style.boxShadow = shadowStyleString;
    });

    shadowsApplied = true;
  }

  document.addEventListener('DOMContentLoaded', fadeIn);
  document.addEventListener('DOMContentLoaded', initShadows);
  window.addEventListener('scroll', initShadows);
  window.addEventListener('scroll', isInView);
  window.addEventListener('wheel', isInView);
  window.addEventListener('resize', isInView);
})();
