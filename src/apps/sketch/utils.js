export const getURLParam = (param) => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    return urlParams.get(param)
}

export function insertParam(key, value) {
    if (window.history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${key}=${value}`;
        window.history.pushState({ path: newurl }, '', newurl);
    }
}