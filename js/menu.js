// Pixels scrolled before fix menu
var offset = 20;

window.addEventListener('scroll', positionMenu);

function positionMenu() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  var menu = document.getElementsByClassName('header__nav')[0];

  if (scrollTop > offset) {
    menu.classList.add('header__nav_fixed');
  } else {
    menu.classList.remove('header__nav_fixed');
  }
}
