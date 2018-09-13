import { SearchApiError } from '../api/api';

export function get(url) {
    return new Promise(((resolve, reject) => {
        const favoriteAdsString = localStorage.getItem('favorites');
        const favoriteAds = favoriteAdsString !== null ? JSON.parse(favoriteAdsString) : [];
        setTimeout(() => {
            resolve(favoriteAds);
        }, 500);
    }));
}

export function post(url, data) {
    return new Promise(((resolve, reject) => {
        const favoritesString = localStorage.getItem('favorites');
        const favoritesOld = favoritesString !== null ? JSON.parse(favoritesString) : [];
        const favoritesNew = [...favoritesOld, data];
        localStorage.setItem('favorites', JSON.stringify(favoritesNew));
        setTimeout(() => {
            resolve(favoritesNew);
        }, 500);
    }));
}

export function remove(uuid) {
    return new Promise(((resolve, reject) => {
        const favoritesString = localStorage.getItem('favorites');
        const favoritesOld = favoritesString !== null ? JSON.parse(favoritesString) : [];
        const favorites = favoritesOld.filter((favorite) => favorite.uuid !== uuid);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setTimeout(() => {
            resolve(favorites);
        }, 500);
    }));
}

