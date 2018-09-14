export function get(url) {
    return new Promise(((resolve, reject) => {
        const savedSearchesString = localStorage.getItem('savedSearches');
        const savedSearches = savedSearchesString !== null ? JSON.parse(savedSearchesString) : [];
        setTimeout(() => {
            resolve(savedSearches);
        }, 500);
    }));
}

export function post(url, data) {
    return new Promise(((resolve, reject) => {
        const savedSearchesString = localStorage.getItem('savedSearches');
        const savedSearchesOld = savedSearchesString !== null ? JSON.parse(savedSearchesString) : [];
        const savedSearchesNew = [...savedSearchesOld, data];
        localStorage.setItem('savedSearches', JSON.stringify(savedSearchesNew));
        setTimeout(() => {
            resolve(savedSearchesNew);
        }, 500);
    }));
}

export function remove(uuid) {
    return new Promise(((resolve, reject) => {
        const savedSearchesString = localStorage.getItem('savedSearches');
        const savedSearchesOld = savedSearchesString !== null ? JSON.parse(savedSearchesString) : [];
        const savedSearches = savedSearchesOld.filter((favorite) => favorite.uuid !== uuid);
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
        setTimeout(() => {
            resolve(savedSearches);
        }, 500);
    }));
}

export function update(updated) {
    return new Promise(((resolve, reject) => {
        const savedSearchesString = localStorage.getItem('savedSearches');
        const savedSearchesOld = savedSearchesString !== null ? JSON.parse(savedSearchesString) : [];
        const savedSearchesNew = savedSearchesOld.map((savedSearch) => {
            if (savedSearch.uuid === updated.uuid) {
                return updated;
            }
            return savedSearch;
        });
        localStorage.setItem('savedSearches', JSON.stringify(savedSearchesNew));
        setTimeout(() => {
            resolve(savedSearchesNew);
        }, 500);
    }));
}
