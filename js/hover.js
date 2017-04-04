(function() {
    var TABLET_BREAK_POINT = 768;
    var currentHovered = null;
    function onMouseOver(wrap) {
        if (window.innerWidth <= TABLET_BREAK_POINT) {
            return
        }

        var element = wrap;
        element.classList.add('hover_transition');
    
        if (wrap.parentElement.classList.contains('card_person') || wrap.parentElement.classList.contains('card_life')) {
            return;
        }

        var shadowStyle = element.style.boxShadow;
        element.style.boxShadow = '';
        var currentStyle = element.getAttribute('style');
        element.setAttribute('style', currentStyle + 'box-shadow: ' + shadowStyle + ' !important;');
    }

    function onMouseOut(wrap, event) {
        if (wrap.classList.contains('card_person') || wrap.classList.contains('card_life')) {
            return;
        }

        var shadowStyle = wrap.style.boxShadow;
        wrap.style.boxShadow = ''; // to remove !important operator
        wrap.style.boxShadow = shadowStyle;
    }

    function initHoverAction() {
        var selectors = [
            '.card.card_work:not([class~=card_separator]) .card__wrap',
            '.card.card_person:not([class~=card_separator]) .card__wrap',
            '.card.card_life:not([class~=card_separator]) .card__wrap',
        ]
        var workwraps = document.querySelectorAll(selectors.join(', ')) || [];

        workwraps.forEach(function(wrap) {
            wrap.addEventListener('mouseenter', onMouseOver.bind(null, wrap));
            wrap.addEventListener('mouseleave', onMouseOut.bind(null, wrap));
        }) 
    }

    document.addEventListener('DOMContentLoaded', initHoverAction);
})();