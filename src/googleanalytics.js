(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

// Noen browsere kan blokkere analytics, og window.ga kan derfor være undefined
window.analytics = (...args) => {
    if (window.ga !== undefined && window.ga !== null) {
        try {
            window.ga(args);
        } catch (e) {
            // ignore error
        }
    }
};

window.analytics('create', 'UA-9127381-24', 'auto');
window.analytics('set', 'anonymizeIp', true);
