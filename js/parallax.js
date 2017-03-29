var TRANSLATE_RATIO = 0.1;
var MEASUREMENT = 'px';
var prevScrollY = 0;
function parallax(event) {
  var scrollDown = window.scrollY > prevScrollY;
  var STEP = (window.scrollY - prevScrollY) * -TRANSLATE_RATIO;
  prevScrollY = window.scrollY;
  var rightCards = document.querySelectorAll('.card.card_right.card_in-view');
  if (!rightCards.length) {
    return;
  }

  rightCards.forEach(function(card) {
    var transformString = card.style.transform;
    if (!transformString.length) {
      card.style.transform = 'translate(0, ' + STEP * (scrollDown ? -1 : 1) + MEASUREMENT + ')';
    } else {
      var translateRegexp = /translate\(-*\d+.?\d*[a-z]*,\s-*\d+.?\d*[a-z]*\)/;
      var translateValueRegexp = /-*\d+[.\d*]?\w*/g;

      var translateString = transformString.match(translateRegexp);
      if (translateString === null) {
        return;
      } else {
        translateString = translateString[0];
      }

      var translateValue = translateString.match(translateValueRegexp);
      if (translateValue === null) { return; }

      if (translateValue.length === 1) {
        translateValue.push((STEP) + MEASUREMENT);
      } else {
        var valueY = parseFloat(translateValue[1], 10);
        translateValue[1] = (valueY + STEP) + MEASUREMENT;
      }

      translateIndex = transformString.indexOf(translateString);
      var transformStringWithoutTranslate = transformString.slice(0, translateIndex) + transformString.slice(translateIndex + translateString.length);
      card.style.transform = transformStringWithoutTranslate + 'translate(' + translateValue.join(', ') + ')';
    }
  });
}

window.addEventListener('scroll', parallax);
