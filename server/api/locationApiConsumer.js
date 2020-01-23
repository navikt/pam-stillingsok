const fetch = require('node-fetch');

const host = process.env.PAMADUSER_URL ? process.env.PAMADUSER_URL : 'https://arbeidsplassen.nav.no';
const baseUrl = `${host}/aduser/api/v1/geography/`;

const fetchLocations = async (type = "counties") => {
    const url = `${baseUrl}${type}`;
    try {
        const response = await fetch(url);
        return response.json();
    } catch (e) {
        throw e;
    }
};

exports.fetchAndProcessLocations = async () => {
    let [municipals, counties] = await Promise.all([fetchLocations("municipals"), fetchLocations()]);

    if ((typeof counties === 'object' && counties.status > 200) ||
        typeof municipals === 'object' && municipals.status > 200) {
        console.error('Location fetch failed!!!');
        return [];
    }

    const countyMap = {};

    counties.forEach(c => {
        countyMap[c.code] = {
            key: c.name,
            code: c.code,
            municipals: [],
        };
    });

    municipals.forEach(m => {
        if (countyMap[m.countyCode] !== undefined) {
            countyMap[m.countyCode].municipals.push({
                key: `${countyMap[m.countyCode].key}.${m.name}`,
                code: m.code,
            });
        }
    });

    const res = [
        {
            key: 'UTLAND',
            municipals: [],
            code: 999,
        }
    ];

    for (let key in countyMap) {
        if (countyMap.hasOwnProperty(key)) {
            res.push(countyMap[key]);
        }
    }

    return res;
};
