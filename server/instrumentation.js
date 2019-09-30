const prometheus = require('prom-client');

const routes = (app) => {
    app.get('/stillinger/internal/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });
};
const stillingsokCounter = () => {
    const counter = new prometheus.Counter({
        name: 'arbeidsplassen_stillingsok_hits',
        help: 'nr of reqests to /stillinger'
    });

    return {
        inc: () => {
            counter.inc();
        }
    };
};
const favoritterCounter = () => {
    const counter = new prometheus.Counter({
        name: 'arbeidsplassen_favoritter_hits',
        help: 'nr of reqests to /stillinger/favoritter'
    });

    return {
        inc: () => {
            counter.inc();
        }
    };
};
const lagredeSokCounter = () => {
    const counter = new prometheus.Counter({
        name: 'arbeidsplassen_lagredesok_hits',
        help: 'nr of reqests to /stillinger/lagrede-sok'
    });

    return {
        inc: () => {
            counter.inc();
        }
    };
};

const setup = (app) => {
    prometheus.collectDefaultMetrics({ timeout: 5000 });
    routes(app);
    return {
        stillingsokCounter, favoritterCounter, lagredeSokCounter
    };
};


module.exports = {
    setup
};
