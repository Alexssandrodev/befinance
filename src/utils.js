
export function setLocalStorage(key, element) {
    localStorage.setItem(key, JSON.stringify(element));
}

export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
