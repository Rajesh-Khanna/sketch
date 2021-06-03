export const getURLParam = (param) => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    return urlParams.get(param)
}

export const getPathParam = () => {
    const pathValues = window.location.pathname.split('/');
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