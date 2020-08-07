export default class LocationSearchParser {

    static extractParam(param, nullValue) {
        let value = nullValue;

        window.location.search.split('&').forEach(q => {
            const split = q.split('=');

            if (split.length === 2 && split[0].includes(param)) {
                value = split[1];
            }
        });

        return value;
    }
}
