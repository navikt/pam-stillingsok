class GeojsonDataService {
    static hentGeoJsonFraLocalStorage() {
        let geoJson;
        try {
            geoJson = localStorage.getItem('geoJson');
        } catch (e) {
            // console.error('feilet ved henting av geoJson fra localStorage');
        }

        try {
            return JSON.parse(geoJson);
        } catch (e) {
            // console.error('feilet ved henting av geoJson fra localStorage, sletter innslag fra local storage');
            localStorage.removeItem('geoJson');
        }
        return undefined;
    }

    static fetchGeoJson(file) {
        return fetch(`/sok/static/data/geojson/${file}`, {
            headers: {
                Accept: 'application/json'
            }
        });
    }

    constructor() {
        this.geoJson = GeojsonDataService.hentGeoJsonFraLocalStorage();
    }

    getVersjon = () =>
        new Promise((resolve, reject) => {
            GeojsonDataService.fetchGeoJson('versjon.json').then(
                (response) => response.json().then((json) => resolve(json)),
                (error) => reject(error)
            );
        });

    getData = () =>
        new Promise((resolve, reject) => {
            this.getVersjon().then(
                (versjonresponse) => {
                    if (
                        this.geoJson &&
                        this.geoJson.versjon &&
                        this.geoJson.fylkegrenser &&
                        this.geoJson.kommunegrenser &&
                        this.geoJson.versjon === versjonresponse.versjon
                    ) {
                        resolve({
                            fylkegrenser: this.geoJson.fylkegrenser,
                            kommunegrenser: this.geoJson.kommunegrenser
                        });
                    } else {
                        Promise.all([
                            GeojsonDataService.fetchGeoJson('fylker_geojson.json'),
                            GeojsonDataService.fetchGeoJson('kommuner_geojson.json')
                        ]).then(
                            (responses) => {
                                Promise.all(responses.map((response) => response.json())).then(
                                    (jsons) => {
                                        this.geoJson = {
                                            versjon: versjonresponse.versjon,
                                            fylkegrenser: jsons[0],
                                            kommunegrenser: jsons[1]
                                        };
                                        localStorage.setItem('geoJson', JSON.stringify(this.geoJson));
                                        resolve(this.geoJson);
                                    },
                                    (error) => reject(error)
                                );
                            },
                            (error) => reject(error)
                        );
                    }
                },
                (error) => reject(error)
            );
        });
}

const geojsonDataService = new GeojsonDataService();
export default geojsonDataService;
