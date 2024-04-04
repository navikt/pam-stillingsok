export default function isBrowserAndHasNetwork() {
    if (window && window.navigator.onLine) {
        console.log("HAS INTERNET");
        return true;
    }
    console.log("HAS NOOOOO INTERNET");
    return false;
}
