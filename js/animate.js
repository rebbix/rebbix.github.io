var animationElements = document.querySelectorAll('.card');

function isInView() {
  var windowHeight = window.innerHeight;

  animationElements.forEach(function(element) {
    var elementBounds = element.getBoundingClientRect();
    var elementTop = elementBounds.top;

    if (elementTop <= windowHeight) {
      element.classList.add('card_in-view');
    } else {
      element.classList.remove('card_in-view');
    }
  });
}

window.addEventListener('scroll', isInView);
window.addEventListener('resize', isInView);
isInView();