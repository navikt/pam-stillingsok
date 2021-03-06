const prometheus = require('prom-client');

const routes = (app) => {
    app.get('/stillinger/internal/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });
};
const pageHitCounter = () => {
    const counter = new prometheus.Counter({
        name: 'arbeidsplassen_stillingsok_page_hits',
        help: 'nr of reqests to stillingsok-pages',
        labelNames: ['page', 'source']
    });

    return {
        inc: (page, source) => {
            counter.inc({
                page: page,
                source: source
            });
        }
    };
};

const setup = (app) => {
    prometheus.collectDefaultMetrics({ timeout: 5000 });
    routes(app);
    return {
        pageHitCounter
    };
};


module.exports = {
    setup
};
