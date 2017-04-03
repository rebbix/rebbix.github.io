(function(window) {
    (function() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;
    })();
    var content = document.querySelector('.content');
    var header = document.querySelector('.header .header__wrap');
    var footer = document.querySelector('.footer');
    var isScrolling = false;

    var translateRegexp = /translate\(-*\d+.?\d*[a-z]*,\s-*\d+.?\d*[a-z]*\)/;
    var translateValueRegexp = /-*\d+[.\d*]?\w*/g;

    function getY() {
        var YValue = 0;
        var transformString = content.style.transform;
        if (transformString.length) {

            var translateString = transformString.match(translateRegexp);
            if (translateString === null) {
                return YValue;
            } else {
                translateString = translateString[0];
            }

            var translateValue = translateString.match(translateValueRegexp);
            if (translateValue === null) { return YValue; }
            YValue = parseFloat(translateValue[1], 10);
        }
        return YValue;
    }

    function setY(y) {
        var transformString = content.style.transform;
        var translateString = transformString.match(translateRegexp);
        if (translateString === null) {
            header.style.transform = 'translate(0, ' + -y + 'px)';
            content.style.transform = 'translate(0, ' + -y + 'px)';  
            document.body.dataset.scrollTop = y;
            return
        } else {
            translateString = translateString[0];
        }
        translateIndex = transformString.indexOf(translateString);
        var translateValue = translateString.match(translateValueRegexp);
        translateValue[1] = -y + 'px';

        var transformStringWithoutTranslate = transformString.slice(0, translateIndex) + transformString.slice(translateIndex + translateString.length);
        var transformStyle = transformStringWithoutTranslate + 'translate(' + translateValue.join(', ') + ')';
        document.body.dataset.scrollTop = y;
        header.style.transform = transformStyle;
        content.style.transform = transformStyle;
        footer.style.transform = transformStyle;
    }

    function scroll() {
        scrolled += (scrollTo - scrolled) * 0.1;

        window.dispatchEvent(new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: (scrollTo - scrolled) * 0.1,
            deltaMode: 0x00
        }));

        setY(scrolled);

        if (Math.abs(scrollTo - scrolled) > 0.1) {
            requestAnimationFrame(scroll);
        } else {
            scrolling = false;
        }
    }

    var scrollTo = 0;
    var scrolled = 0;
    var scrolling = false;
    var footer = document.querySelector('.footer');
    var footerBottomMargin = 20;

    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (!e.isTrusted || isScrolling) return;
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }

        var nextScrollTo  = scrollTo + e.deltaY;

        if (nextScrollTo < 0) {
            nextScrollTo = 0;
        } else if (footer.offsetTop + footer.offsetHeight + footerBottomMargin - window.innerHeight < nextScrollTo) {
            // if whole footer is in viewport
            nextScrollTo = footer.offsetTop + footer.offsetHeight + footerBottomMargin - window.innerHeight;
        }

        scrollTo = nextScrollTo;
        if (!scrolling) {
            scrolling = true;
            requestAnimationFrame(scroll);
         }
    });

    function easeOutCubic(t) { return  (--t)*t*t+1 };

    function scrollContentTo(scrollingDistance, duration, callback) {
        isScrolling = true;

        var endOfAnimation = Date.now() + duration;
        var scrollPositionOnStart = parseFloat(document.body.dataset.scrollTop, 10) || 0;
        var scrollPositionOnEnd = scrollPositionOnStart + scrollingDistance
        var scrollDown = scrollPositionOnStart < scrollPositionOnStart + scrollingDistance;
        function scroll(timestamp) {
            var progress = 1 - (endOfAnimation - Date.now()) / duration; // in range [0, 1];
            progress = progress <= 1 ? progress : 1;
            var scrollStep = scrollingDistance * easeOutCubic(progress);
            var nextScrollPositino = scrollPositionOnStart + scrollStep;
            setScrollPosition(nextScrollPositino);

            var notTargetPosition = scrollDown ? nextScrollPositino < scrollPositionOnEnd : scrollPositionOnEnd < nextScrollPositino;
            if (notTargetPosition) {
                requestAnimationFrame(scroll);
            } else {
                scrolled += scrollingDistance;
                scrollTo += scrollingDistance;
                isScrolling = false;
                callback && callback();
            }
        }

        requestAnimationFrame(scroll);
    }

    var content = document.querySelector('.content');
    var header = document.querySelector('.header .header__wrap');
    var footer = document.querySelector('.footer');
    function setScrollPosition(position) {
        var currentBodyScroll = parseFloat(document.body.dataset.scrollTop, 10) || 0;
        content.style.transform = `translate(0, ${-position}px)`;
        header.style.transform = `translate(0, ${-position}px)`;
        document.body.dataset.scrollTop = position;

        window.dispatchEvent(new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: position - currentBodyScroll,
            deltaMode: 0x00
        }));
    }

    function preventHomeAndEnd(e) {
        var toPrevent = [37, 38, 39, 40];
        var arrows = toPrevent.some(function(keyCode) { return keyCode === e.keyCode; });
        var isHomeEnd = e.keyCode === 35 || e.keyCode === 36;
        if (e.metaKey && arrows || isHomeEnd) {
            e.preventDefault();
        } else if (!e.metaKey && arrows) {
            e.preventDefault();
            var deltaY = 0;
            if (e.keyCode === 38) {
                deltaY = -20;
            } else if (e.keyCode === 40) {
                deltaY = 20;
            }

            window.dispatchEvent(new WheelEvent('wheel', {
                deltaX: 0,
                deltaY: deltaY,
                deltaMode: 0x00
            }));
        }
    }

    window.addEventListener('keydown', preventHomeAndEnd);
    window.addEventListener('keypress', preventHomeAndEnd);
    window.addEventListener('keyup', preventHomeAndEnd);

    window.ScrollManager = {
        scrollContentTo: scrollContentTo
    }
})(window);
