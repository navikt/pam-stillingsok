const fetch = require("node-fetch");

const host = process.env.PAMADUSER_URL ? process.env.PAMADUSER_URL : "https://arbeidsplassen.nav.no";
const baseUrl = `${host}/api/v1/geography/`;

const fetchLocations = async (type = "counties") => {
    const url = `${baseUrl}${type}`;
    try {
        const response = await fetch(url);
        return response.json();
    } catch (e) {
        return null;
    }
};

exports.fetchAndProcessLocations = async () => {
    const [municipals, counties] = await Promise.all([fetchLocations("municipals"), fetchLocations()]);

    // Aduser is unresponsive
    if (municipals === null || counties === null) {
        return null;
    }

    const countyMap = {};

    counties.forEach((c) => {
        countyMap[c.code] = {
            key: c.name,
            code: c.code,
            municipals: [],
        };
    });

    municipals.forEach((m) => {
        if (countyMap[m.countyCode] !== undefined) {
            countyMap[m.countyCode].municipals.push({
                key: `${countyMap[m.countyCode].key}.${m.name}`,
                code: m.code,
            });
        }
    });

    const res = [
        {
            key: "UTLAND",
            municipals: [],
            code: 999,
        },
    ];

    Object.values(countyMap).forEach((value) => {
        res.push(value);
    });

    return res;
};
