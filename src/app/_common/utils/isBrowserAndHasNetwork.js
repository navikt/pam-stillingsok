export default function isBrowserAndHasNetwork() {
    if (window && window.navigator.onLine) {
        return true;
    }
    return false;
}
