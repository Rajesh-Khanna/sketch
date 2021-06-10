export const getURLParam = (param) => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    return urlParams.get(param)
}

export const getPathParam = () => {
    const pathValues = window.location.pathname.split('/').filter(el => el.length !== 0);
    console.log({ pathValues });
    if (pathValues.length === 0) return null;
    return pathValues[pathValues.length - 1];
}


export function insertParam(key, value) {
    if (window.history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${key}=${value}`;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}

export function isScreenLarge() {
    if (window.innerWidth >= 992) return true;
    return false;
}

export const getChannel = message => message.currentTarget.label;

export const setCanvasSize = (canvas, width, height) => {
    const relativeHeight = parseInt(width / 2);
    const relativeWidth = height * 2;

    if (relativeHeight > height) {
        canvas.height = height;
        canvas.width = relativeWidth;
    } else {
        canvas.height = relativeHeight;
        canvas.width = width;
    }
}

var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        // eslint-disable-next-line getter-return
        get: function() { supportsPassive = true; }
    }));
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
export function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
export function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}