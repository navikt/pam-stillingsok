const host = process.env.PAM_STILLINGSREGISTRERING_API_URL ? process.env.PAM_STILLINGSREGISTRERING_API_URL : 'http://pam-stillingsregistrering-api';
const baseUrl = `${host}/stillingsregistrering-api/api/geografi/`;

const fetchGeography = async (type = "fylker") => {
    const url = `${baseUrl}/${type}`;
    try {
        const response = await fetch({ url });
        return response.json();
    } catch (e) {
        throw e;
    }
};

const fetchAndProcessGeography = async () => {
    const [ counties, municipals ] = await Promise.all([fetchGeography("kommuner"), fetchGeography()]);
    const res = municipals.map(m => {
        const filteredCounties = counties.filter(it => it.countyCode === m.code);
    })
};

