// eslint-disable-next-line no-unused-vars
function RB_Sticky() {
  const stickyProcess = () => {
    const { logoNode, logoTopOffset, sticky } = this;
    if (!logoNode) return;
    const { SCROLL_Y } = window.SHARED;
    const distance = logoTopOffset - SCROLL_Y;
    if (distance <= 0 && !sticky) {
      logoNode.classList.add("sticky");
      this.sticky = true;
    } else if (sticky && distance > 0) {
      logoNode.classList.remove("sticky");
      this.sticky = false;
    }
  };

  const scrollHintProcess = () => {
    const { scrollHintNode, scrollHintHidden } = this;
    if (!scrollHintNode) return;
    const { SCROLL_Y } = window.SHARED;
    if (SCROLL_Y > 20 && !scrollHintHidden) {
      this.scrollHintHidden = true;
      scrollHintNode.classList.add("hidden")
    } else if (SCROLL_Y <= 20 && scrollHintHidden) {
      this.scrollHintHidden = false;
      scrollHintNode.classList.remove("hidden")
    }
  };

  const scrollWatcher = () => {
    window.requestAnimationFrame(() => {
      stickyProcess();
      scrollHintProcess();
    });
  };

  const init = () => {
    this.sticky = false;
    this.scrollHintHidden = false;
    this.logoNode = document.getElementById("headerLogo");
    this.logoTopOffset = this.logoNode && this.logoNode.offsetTop;
    this.scrollHintNode = document.getElementById("headerScrollHint");
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
