export default function initHotjar() {
    console.time("initHotjar");
    document.querySelector("body").setAttribute("data-hj-masked", "");
    document.querySelector("html").setAttribute("data-hj-suppress", "");
    /* eslint-disable */
    (function (h, o, t, j, a, r) {
        h.hj =
            h.hj ||
            function () {
                (h.hj.q = h.hj.q || []).push(arguments);
            };
        h._hjSettings = { hjid: 118350, hjsv: 5 };
        a = o.getElementsByTagName("head")[0];
        r = o.createElement("script");
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
    })(window, document, "//static.hotjar.com/c/hotjar-", ".js?sv=");
    console.timeEnd("initHotjar");
    /* eslint-enable */
}
