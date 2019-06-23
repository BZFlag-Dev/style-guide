import { toggleBooleanString } from './common';

const menuToggle = document.querySelector('#menu-toggle');

if (menuToggle) {
    menuToggle.addEventListener('click', function () {
        toggleBooleanString(this, 'aria-expanded');
    });
}
