var animationElements = document.querySelectorAll('.card');

function isInView() {
  var windowHeight = window.innerHeight;
  var animationElementsCount = animationElements.length;

  for (var i = 0; i < animationElementsCount; i++) {
    var element = animationElements[i];
    var elementBounds = element.getBoundingClientRect();
    var elementTop = elementBounds.top;

    if (elementTop <= windowHeight - windowHeight * 0.3) {
      element.classList.add('card_in-view');
    } else {
      element.classList.remove('card_in-view');
    }
  }
}

window.addEventListener('scroll', isInView);
window.addEventListener('resize', isInView);
isInView();