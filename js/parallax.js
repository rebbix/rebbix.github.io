(function() {
    var TRANSLATE_RATIO = 0.15;
    var MEASUREMENT = 'px';
    var prevScrollY = 0;
    var visibleOnLoad = 0;
    var mobileViewport = false;
    var parallaxCleared = false;
    function parallax(event) {
        var rightCards = document.querySelectorAll('.card.card_right.card_in-view[class~=card_person],.card.card_right.card_in-view[class~=card_work]');
        if (!rightCards.length) {
            return;
        }
        if (mobileViewport) {
            if (parallaxCleared) { 
                return;
            }
            rightCards.forEach(function(card) {
                var transformString = card.style.transform;
                if (transformString.length) {
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

                    translateValue[1] = 0 + MEASUREMENT;
                    translateIndex = transformString.indexOf(translateString);

                    var transformStringWithoutTranslate = transformString.slice(0, translateIndex) + transformString.slice(translateIndex + translateString.length);
                    card.style.transform = transformStringWithoutTranslate + 'translate(' + translateValue.join(', ') + ')';
                }
            });
            parallaxCleared = true;
            return;
        }
        parallaxCleared = false;

        var scrollDown = window.scrollY > prevScrollY;
        var STEP = (window.scrollY - prevScrollY) * -TRANSLATE_RATIO;
        prevScrollY = window.scrollY;
        if (!scrollDown && window.scrollY < visibleOnLoad) {
            visibleOnLoad = window.scrollY;
        }

        rightCards.forEach(function(card) {
            var cardTopPosition = card.offsetTop;

            // to prevent parallax for those cards, which were hiegher, than viewport
            // when page loaded
            if (cardTopPosition < visibleOnLoad + window.innerHeight - window.innerHeight * 0.35) {
                return
            }

            var transformString = card.style.transform;
            if (!transformString.length) {
                card.style.transform = 'translate(0, ' + STEP + MEASUREMENT + ')';
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

    var TABLET_BREAK_POINT = 768;
    function checkViewportWidth() {
        if (window.innerWidth <= TABLET_BREAK_POINT) {
            mobileViewport =  true;
        } else if (mobileViewport) {
            mobileViewport = false;
            visibleOnLoad = window.scrollY;
        }
    }

    window.addEventListener('resize', checkViewportWidth)
    window.addEventListener('scroll', parallax);
    window.addEventListener('load', function() {
        visibleOnLoad = window.scrollY;
        checkViewportWidth();
    });    
})();