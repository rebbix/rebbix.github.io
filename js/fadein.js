function fadeIn() {
    var header = document.querySelector('.header')
    if (!header) {
        return;
    }
    header.classList.add('shown');
}

window.addEventListener('load', fadeIn);