var animationElements = document.querySelectorAll('.card');
var visibleOnInitialScreen = [];

function isInView(initialCards) {
  var windowHeight = window.innerHeight;
  var animationElementsCount = animationElements.length;

  for (var i = 0; i < animationElementsCount; i++) {
    var element = animationElements[i];
    var elementBounds = element.getBoundingClientRect();
    var elementTop = elementBounds.top;
    var appearingHeight = initialCards === true ? windowHeight : windowHeight - windowHeight * 0.35;

    if (initialCards === true && elementTop <= appearingHeight) {
      visibleOnInitialScreen.push(element);
    }

    if (elementTop <= appearingHeight) {
      element.classList.add('card_in-view');
    } else if (!visibleOnInitialScreen.includes(element)) {
      element.classList.remove('card_in-view');
    }
  }
}

window.addEventListener('scroll', isInView);
window.addEventListener('resize', isInView);
setTimeout(isInView.bind(null, true), 800);
