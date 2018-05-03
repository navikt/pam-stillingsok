import { get } from './rest';

class DataService {
    constructor() {
        this.cache = [];
    }

    removeExpiredItems = () => {
        const now = new Date().getTime();
        this.cache = this.cache.filter((item) => item.timestamp >= now);
    };

    getData = (url, query, cacheTimeInMillisec) => {
        this.removeExpiredItems();
        const cacheKey = url + JSON.stringify(query);
        const cachedData = this.cache.find((item) => item.key === cacheKey);
        return new Promise((resolve, reject) => {
            if (cachedData) {
                resolve(cachedData.value);
            } else {
                get(url, query).then(
                    (response) => {
                        this.cache = [...this.cache, {
                            key: cacheKey,
                            value: response,
                            timestamp: new Date().getTime() + (cacheTimeInMillisec || (1000 * 60 * 10))
                        }];
                        resolve(response);
                    },
                    (error) => reject(error)
                );
            }
        });
    };
}

const dataService = new DataService();
export default dataService;
