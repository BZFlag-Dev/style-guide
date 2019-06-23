export function indexLoop(array, index) {
    const maxLength = array.length;
    let realIndex = index;

    if (realIndex < 0) {
        realIndex = maxLength - 1;
    } else if (realIndex > maxLength - 1) {
        realIndex = 0;
    }

    return realIndex;
}

/**
 * Toggle a string boolean on an element.
 *
 * @param {Element} element
 * @param {string} attribute
 */
export function toggleBooleanString(element, attribute) {
    const value = element.getAttribute(attribute);

    element.setAttribute(attribute, value === 'true' ? 'false' : 'true');
}

const keyboard = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,

    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,

    HOME: 36,
    END: 35,
};

export {
    keyboard
};
