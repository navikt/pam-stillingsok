export function get(url) {
    return new Promise(((resolve, reject) => {
        const favoriteAdsString = localStorage.getItem('favorites');
        const favoriteAds = favoriteAdsString !== null ? JSON.parse(favoriteAdsString) : [];
        resolve(favoriteAds);
    }));
}

export function post(url, data) {
    return new Promise(((resolve, reject) => {
        const favoritesString = localStorage.getItem('favorites');
        const favoritesOld = favoritesString !== null ? JSON.parse(favoritesString) : [];
        const favoritesNew = [...favoritesOld, data];
        localStorage.setItem('favorites', JSON.stringify(favoritesNew));
        resolve(favoritesNew);
    }));
}

export function remove(uuid) {
    return new Promise(((resolve, reject) => {
        const favoritesString = localStorage.getItem('favorites');
        const favoritesOld = favoritesString !== null ? JSON.parse(favoritesString) : [];
        const favorites = favoritesOld.filter((favorite) => favorite.uuid !== uuid);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        resolve(favorites);
    }));
}

