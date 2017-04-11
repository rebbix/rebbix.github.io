(function(window) {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    var TABLET_BREAK_POINT = 768;
    var content = document.querySelector('.content');
    var header = document.querySelector('.header .header__wrap');
    var footer = document.querySelector('.footer');
    var scrollBar = document.createElement('DIV');
    var scrollThumb = document.createElement('DIV');
    var scrollTo = 0;
    var scrolled = 0;
    var scrolling = false;
    var footerBottomMargin = 20;
    var isScrolling = false;
    var thumbPressed = false;
    var SCROLL_RATIO = 0.15;

    function updateScrollBarPosition() {
        if (window.innerWidth < TABLET_BREAK_POINT) {
            return;
        }
        var windowHeight = window.innerHeight;
        var pageHeight = getPageHeight();
        var scrollPosition = (+document.body.dataset.scrollTop || 0);
        var scrollThumbHeight = windowHeight * (parseInt((windowHeight / (pageHeight + windowHeight)) * 10000) / 10000);
        scrollThumbHeight = scrollThumbHeight < 100 ? 100 : scrollThumbHeight;
        var scrollIsPercentage = (scrollPosition / pageHeight) * 100;
        var scrollThumbTop = ((windowHeight - scrollThumbHeight) * scrollIsPercentage) / windowHeight;

        scrollThumb.style.height = scrollThumbHeight + 'px';
        scrollThumb.style.top = scrollThumbTop + '%';
    }

    var prevPointerPosition = null;
    function scrollBarMove(e) {
        if (!thumbPressed) {
            return;
        }
        document.body.classList.add('no-user-select');
        scrollThumb.classList.add('scroll__thumb_active');
        var rect = scrollThumb.getBoundingClientRect();
        var pointerDiff = e.clientY - prevPointerPosition;
        if (rect.top + pointerDiff < 0 || rect.bottom + pointerDiff > window.innerHeight) {
            return;
        }
        var pageDiff = (getPageHeight() * (pointerDiff / window.innerHeight));
        prevPointerPosition = e.clientY;
        scrolled = scrolled + pageDiff;
        scrollTo = scrolled;
        setScroll(scrolled);
        window.dispatchEvent(new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: pointerDiff,
            deltaMode: 0x00
        }));
    }

    function initScrollBar() {
        if (window.innerWidth < TABLET_BREAK_POINT) {
            return;
        }
        var pageHeight = getPageHeight();
        var windowHeight = window.innerHeight;
        scrollThumb.classList.add('scroll__thumb');
        scrollThumb.addEventListener('mousedown', function(e) {
            thumbPressed = true;
            prevPointerPosition = e.clientY;
        });
        window.addEventListener('mousemove', scrollBarMove);
        window.addEventListener('mouseup', function() {
            thumbPressed = false;
            document.body.classList.remove('no-user-select');
            scrollThumb.classList.remove('scroll__thumb_active');
        });
        scrollBar.classList.add('scroll__bar');
        scrollBar.appendChild(scrollThumb);
        document.body.appendChild(scrollBar);
        updateScrollBarPosition();
    }

    var translateRegexp = /translate\(-*\d+.?\d*[a-z]*,\s-*\d+.?\d*[a-z]*\)/;
    var translateValueRegexp = /-*\d+[.\d*]?\w*/g;

    function setScroll(y, shouldUseNativeScroll) {
        if (shouldUseNativeScroll) {
            window.scrollTo(0, y);
            return;
        }
        var transformString = content.style.transform;
        var translateString = transformString.match(translateRegexp);
        if (translateString === null) {
            header.style.transform = 'translate(0, ' + -y + 'px)';
            content.style.transform = 'translate(0, ' + -y + 'px)';
            footer.style.transform = 'translate(0, ' + -y + 'px)';
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
        window.dispatchEvent(new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: y - (+document.body.dataset.scrollTop || 0),
            deltaMode: 0x00
        }));
        document.body.dataset.scrollTop = y;
        header.style.transform = transformStyle;
        content.style.transform = transformStyle;
        footer.style.transform = transformStyle;
        updateScrollBarPosition();
    }

    window.addEventListener('resize', e => {
        var y = +document.body.dataset.scrollTop || 0;
        if (y > getPageHeight()) {
            y = getPageHeight();
        }
        scrollTo = y;
        scrolled = y;
        setScroll(y);
    }); 

    function scroll() {
        scrolled += (scrollTo - scrolled) * SCROLL_RATIO;

        window.dispatchEvent(new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: (scrollTo - scrolled) * SCROLL_RATIO,
            deltaMode: 0x00
        }));

        setScroll(scrolled);

        if (Math.abs(scrollTo - scrolled) > SCROLL_RATIO) {
            requestAnimationFrame(scroll);
        } else {
            scrolling = false;
        }
    }

    function getPageHeight() {
        return footer
            ? (footer.offsetTop + footer.offsetHeight + footerBottomMargin - window.innerHeight)
            : document.body.offsetHeight;
    }

    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        if ((!e.isTrusted && !e.byArrows) || isScrolling) return;
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }

        var nextScrollTo  = scrollTo + e.deltaY;
        var pageHeight = getPageHeight();
        if (nextScrollTo < 0) {
            nextScrollTo = 0;
        } else if (pageHeight < nextScrollTo) {
            // if whole footer is in viewport
            nextScrollTo = pageHeight;
        }

        scrollTo = nextScrollTo;
        if (!scrolling) {
            scrolling = true;
            requestAnimationFrame(scroll);
         }
    });

    function easeOutCubic(t) { return  (--t)*t*t+1 };

    function scrollContentTo(scrollingDistance, duration, callback, shouldUseNativeScroll) {
        isScrolling = true;
        var endOfAnimation = Date.now() + duration;
        var scrollPositionOnStart = shouldUseNativeScroll ? document.body.scrollTop : +document.body.dataset.scrollTop || 0;
        var scrollPositionOnEnd = scrollPositionOnStart + scrollingDistance
        var scrollDown = scrollPositionOnStart < scrollPositionOnStart + scrollingDistance;
        function scroll(timestamp) {
            var progress = 1 - (endOfAnimation - Date.now()) / duration; // in range [0, 1];
            progress = progress <= 1 ? progress : 1;
            var scrollStep = scrollingDistance * easeOutCubic(progress);
            var nextScrollPositino = scrollPositionOnStart + scrollStep;
            setScroll(nextScrollPositino, shouldUseNativeScroll);

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

            var wheelEvent = new WheelEvent('wheel', {
                deltaX: 0,
                deltaY: deltaY,
                deltaMode: 0x00
            });
            wheelEvent.byArrows = true;
            window.dispatchEvent(wheelEvent);
        }
    }

    window.addEventListener('keydown', preventHomeAndEnd);
    window.addEventListener('keypress', preventHomeAndEnd);
    window.addEventListener('keyup', preventHomeAndEnd);
    document.addEventListener('DOMContentLoaded', initScrollBar);
    window.ScrollManager = {
        scrollContentTo: scrollContentTo
    }
})(window);
