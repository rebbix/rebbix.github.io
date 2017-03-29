var currentHovered = null;
function onMouseOver(wrap) {
    var shadowStyle = wrap.style.boxShadow;
    wrap.style.boxShadow = '';
    var currentStyle = wrap.getAttribute('style');

    wrap.classList.add('hover_transition');
    wrap.setAttribute('style', currentStyle + 'box-shadow: ' + shadowStyle + ' !important;');
    currentHovered = wrap;
}

function onMouseOut(wrap, event) {
    var shadowStyle = wrap.style.boxShadow;
    wrap.style.boxShadow = ''; // to remove !important operator
    wrap.style.boxShadow = shadowStyle;
    setTimeout(function() {
        if (currentHovered !== wrap) {
            wrap.classList.remove('hover_transition');
        }
    }, 400);
}

function initHoverAction() {
    var workwraps = document.querySelectorAll('.card.card_work:not([class~=card_separator]) .card__wrap');

    workwraps.forEach(function(wrap) {
        wrap.addEventListener('mouseenter', onMouseOver.bind(null, wrap));
        wrap.addEventListener('mouseleave', onMouseOut.bind(null, wrap));
    }) 
}

window.addEventListener('load', initHoverAction);