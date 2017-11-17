// eslint-disable-next-line no-unused-vars
function Hover() {
  const TABLET_BREAK_POINT = 768;
  function onMouseOver(wrap) {
    if (window.innerWidth <= TABLET_BREAK_POINT) { return; }

    const element = wrap;
    element.classList.add('hover_transition');

    if (wrap.parentElement.classList.contains('card_person') || wrap.parentElement.classList.contains('card_life')) {
      return;
    }

    const shadowStyle = element.style.boxShadow;
    element.style.boxShadow = '';
    element.setAttribute('style', `${element.getAttribute('style')} box-shadow: ${shadowStyle} !important;`);
  }

  function onMouseOut(wrap) {
    if (wrap.classList.contains('card_person') || wrap.classList.contains('card_life')) {
      return;
    }

    const shadowStyle = wrap.style.boxShadow;
    wrap.style.boxShadow = ''; // to remove !important operator
    wrap.style.boxShadow = shadowStyle;
  }

  function initHoverAction() {
    const selectors = [
      '.card.card_work:not([class~=card_separator]) .card__wrap',
      '.card.card_person:not([class~=card_separator]) .card__wrap',
      '.card.card_life:not([class~=card_separator]) .card__wrap',
    ];
    let workwraps = document.querySelectorAll(selectors.join(', ')) || [];
    if (!workwraps.forEach) {
      workwraps = Array.from(workwraps);
    }
    workwraps.forEach((wrap) => {
      wrap.addEventListener('mouseenter', onMouseOver.bind(null, wrap));
      wrap.addEventListener('mouseleave', onMouseOut.bind(null, wrap));
    });
  }

  function getRGBColor(hexColor) {
    const rgb = [];
    if (hexColor.indexOf('#') !== 0) {
      return null;
    }
    const hex = hexColor.slice(1);


    if (hex.length === 3) { // if it is short hex for of color
      hex.split('').forEach((char) => {
        rgb.push(parseInt(Number(`0x${char.toString()}`), 10));
      });
    } else if (hex.length === 6) { // if full hex form
      const hexChars = hex.split('');
      for (let i = 0; i < hexChars.length; i += 2) {
        const hexNumber = Number(`0x${hexChars[i].toString()}${hexChars[i + 1].toString()}`);
        rgb.push(parseInt(hexNumber, 10));
      }
    }

    return rgb;
  }

  let shadowsApplied = false;
  const SHADOW_OPACITY = '0.4';
  const SHADOW_SIZE = '0px 2vw 7vw 1vw';
  const BRIGHTNESS = 0.5;

  function initShadows() {
    if (shadowsApplied) return;

    let workCards = document.querySelectorAll('.card.card_work:not([class~=card_separator])') || [];
    if (!workCards.forEach) {
      workCards = Array.from(workCards);
    }
    workCards.forEach((card) => {
      const wrap = card.querySelector('.card__wrap');
      const shadowColor = wrap.dataset.shadowcolor || '#808080';
      const rgb = getRGBColor(shadowColor).map(color => Math.floor(color * BRIGHTNESS));

      const shadowStyleString = `${SHADOW_SIZE} rgba(${rgb.join(', ')}, ${SHADOW_OPACITY})`;
      wrap.style.boxShadow = shadowStyleString;
    });

    shadowsApplied = true;
  }

  initShadows();
  initHoverAction();
}
