const fetch = require('node-fetch');

const host = process.env.PAM_AD_USER_API ? process.env.PAM_AD_USER_API : 'https://arbeidsplassen.nav.no';
const baseUrl = `${host}/aduser/api/v1/geography/`;

const buildPrettyLabel = (s) => {
    if (typeof s !== 'string') return '';
    s = s.toLowerCase();

    let label = '';

    for (let i = 0; i < s.length; i++) {
        if (i === 0 || s.charAt(i - 1) === ' ' || s.charAt(i - 1) === '-') {
            if (s.charAt(i) === 'o' && s.charAt(i + 1) === 'g' && s.charAt(i + 2) === ' ') label += s.charAt(i).toLowerCase();
            else label += s.charAt(i).toUpperCase();
        } else label += s.charAt(i).toLowerCase();
    }

    return label;
};

const fetchGeography = async (type = "counties") => {
    const url = `${baseUrl}${type}`;
    try {
        const response = await fetch(url);
        return response.json();
    } catch (e) {
        throw e;
    }
};

exports.fetchAndProcessGeography = async () => {
    const [municipals, counties] = await Promise.all([fetchGeography("municipals"), fetchGeography()]);

    if ((typeof counties === 'object' && counties.status > 200) ||
        typeof municipals === 'object' && municipals.status > 200) {
        console.error('Geography fetch failed!!!');
        return [];
    }

    const countyMap = {};

    counties.forEach(c => {
        countyMap[c.code] = {
            label: buildPrettyLabel(c.name),
            key: c.name,
            code: c.code,
            municipals: [],
        };
    });

    municipals.forEach(m => {
        if (countyMap[m.countyCode] !== undefined) {
            countyMap[m.countyCode].municipals.push({
                label: buildPrettyLabel(m.name),
                key: `${countyMap[m.countyCode].key}.${m.name}`,
                code: m.code,
            });
        }
    });

    const res = [];

    for (let key in countyMap) {
        if (countyMap.hasOwnProperty(key)) {
            res.push(countyMap[key]);
        }
    }

    return res;
};
