// eslint-disable-next-line no-unused-vars
function RB_Sticky() {
  const scrollWatcher = () => {
    const { logoNode, logoTopOffset, sticky } = this;
    if (!logoNode) return;
    const { SCROLL_Y } = window.SHARED;
    const distance = logoTopOffset - SCROLL_Y;
    if (distance <= 0 && !sticky) {
      window.requestAnimationFrame(() => {
        logoNode.classList.add('sticky');
      })
      this.sticky = true;
    } else if (sticky && distance > 0) {
      window.requestAnimationFrame(() => {
        logoNode.classList.remove('sticky');
      })
      this.sticky = false;
    }
  };
  
  const init = () => {
    this.sticky = false;
    this.logoNode = document.getElementById("headerLogo");
    this.logoTopOffset = this.logoNode && this.logoNode.offsetTop;
    scrollWatcher();
  };

  const exportedInit = init.bind(this);
  // eslint-disable-next-line consistent-return
  return {
    init: exportedInit,
    onload: exportedInit,
    onResize: exportedInit,
    onscroll: scrollWatcher
  };
}
