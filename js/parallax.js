(function() {
    var TRANSLATE_RATIO = 0.15;
    var measurement = 'vw';
    var ratio = 0.01;
    var prevScrollY = 0;
    var visibleOnLoad = 0;
    var mobileViewport = false;
    var parallaxCleared = false;
    var selectors = [
        '.card.card_right.card_in-view[class~=card_person]',
        '.card.card_right.card_in-view[class~=card_work]',
    ];
    var translateRegexp = /translate\(-*\d+.?\d*[a-z]*,\s-*\d+.?\d*[a-z]*\)/;
    var translateValueRegexp = /-*\d+[.\d*]?\w*/g;

    function initTransforms() {
        var rightCards = document.querySelectorAll(selectors.join(', '));
        rightCards.forEach(function(card) {
            var transformString = card.style.transform;
            if (transformString.length) {
                var translateString = transformString.match(translateRegexp);
                if (translateString === null) {
                    return;
                } else {
                    translateString = translateString[0];
                }

                var translateValue = translateString.match(translateValueRegexp);
                if (translateValue === null) { return; }

                translateValue[1] = 0 + measurement;
                translateIndex = transformString.indexOf(translateString);

                var transformStringWithoutTranslate = transformString.slice(0, translateIndex) + transformString.slice(translateIndex + translateString.length);
                card.style.transform = transformStringWithoutTranslate + 'translate(' + translateValue.join(', ') + ')';
            }
        });
        parallaxCleared = true;
    }

    function parallax() {
        var rightCards = document.querySelectorAll(selectors.join(', '));

        if (!rightCards.length) {
            return;
        }
        if (mobileViewport) {
            if (parallaxCleared) {
                return;
            }
            initTransforms();
            return;
        }
        parallaxCleared = false;

        var currentScroll = parseFloat(document.body.dataset.scrollTop, 10) || 0;
        var scrollDown = currentScroll > prevScrollY;
        prevScrollY = currentScroll;

        rightCards.forEach(function(card) {
            var transformString = card.style.transform;
            if (!transformString.length) {
                card.style.transform = 'translate(0, ' + 0 + 'vw)';
                card.dataset.appearedOn = currentScroll;
            } else {
                var translateString = transformString.match(translateRegexp);
                if (translateString === null) {
                    return;
                } else {
                    translateString = translateString[0];
                }

                var appearedOn = parseFloat(card.dataset.appearedOn, currentScroll, 10);

                var translateValue = translateString.match(translateValueRegexp);
                if (translateValue === null) { return; }

                var parallaxStep = -(currentScroll - appearedOn) * ratio + measurement;

                translateValue[1] = parallaxStep;

                translateIndex = transformString.indexOf(translateString);
                var transformStringWithoutTranslate = transformString.slice(0, translateIndex) + transformString.slice(translateIndex + translateString.length);
                card.style.transform = transformStringWithoutTranslate + 'translate(' + translateValue.join(', ') + ')';
            }
        });
    }

    var TABLET_BREAK_POINT = 768;
    var STATIC_CONTENT_BREAK_POINT = 1440;
    function checkViewportWidth() {
        if (window.innerWidth <= TABLET_BREAK_POINT) {
            mobileViewport =  true;
        } else if (mobileViewport) {
            mobileViewport = false;
            visibleOnLoad = window.scrollY;
        } else if (window.innerWidth >= STATIC_CONTENT_BREAK_POINT) {
            measurement = 'px';
            ratio = 0.15;
        } else {
            measurement = 'vw';
            ratio = 0.01;
        }
    }

    window.addEventListener('resize', checkViewportWidth);
    window.addEventListener('wheel', parallax);
    window.addEventListener('load', function() {
        visibleOnLoad = window.scrollY;
        initTransforms();
        checkViewportWidth();
    });
})();