import { put, select, takeLatest } from 'redux-saga/es/effects';
import capitalizeLocation from '../common/utils/capitalizeLocation';
import { CONTEXT_PATH } from '../fasitProperties';
import {
    ADD_SAVED_SEARCH_SUCCESS,
    RESTORE_STATE_FROM_SAVED_SEARCH,
    SET_CURRENT_SAVED_SEARCH
} from '../savedSearches/savedSearchesReducer';
import { PublishedLabelsEnum } from './facets/Published';
import { LOAD_MORE, PAGE_SIZE, RESET_SEARCH, SEARCH } from './searchReducer';
import { toObject, toQueryString } from '../utils';


const LATEST_QUERY_STRING_KEY = 'latestQueryString';

export const RESTORE_STATE_FROM_URL_BEGIN = 'RESTORE_STATE_FROM_URL_BEGIN';
export const RESTORE_STATE_FROM_URL = 'RESTORE_STATE_FROM_URL';
export const RESET_PAGINATION = 'RESET_PAGINATION';
export const ADD_MUNICIPAL = 'ADD_MUNICIPAL';
export const REMOVE_MUNICIPAL = 'REMOVE_MUNICIPAL';
export const ADD_COUNTY = 'ADD_COUNTY';
export const REMOVE_COUNTY = 'REMOVE_COUNTY';
export const ADD_COUNTRY = 'ADD_COUNTRY';
export const REMOVE_COUNTRY = 'REMOVE_COUNTRY';
export const ADD_OCCUPATION_FIRST_LEVEL = 'ADD_OCCUPATION_FIRST_LEVEL';
export const REMOVE_OCCUPATION_FIRST_LEVEL = 'REMOVE_OCCUPATION_FIRST_LEVEL';
export const ADD_OCCUPATION_SECOND_LEVEL = 'ADD_OCCUPATION_SECOND_LEVEL';
export const REMOVE_OCCUPATION_SECOND_LEVEL = 'REMOVE_OCCUPATION_SECOND_LEVEL';
export const ADD_ENGAGEMENT_TYPE = 'ADD_ENGAGEMENT_TYPE';
export const REMOVE_ENGAGEMENT_TYPE = 'REMOVE_ENGAGEMENT_TYPE';
export const ADD_EXTENT = 'ADD_EXTENT';
export const REMOVE_EXTENT = 'REMOVE_EXTENT';
export const ADD_SECTOR = 'ADD_SECTOR';
export const REMOVE_SECTOR = 'REMOVE_SECTOR';
export const SET_PUBLISHED = 'SET_PUBLISHED';
export const SET_SEARCH_STRING = 'SET_SEARCH_STRING';
export const SET_SORTING = 'SET_SORTING';


const initialState = {
    q: '',
    from: 0,
    to: PAGE_SIZE,
    counties: [],
    countries: [],
    engagementType: [],
    extent: [],
    municipals: [],
    occupationFirstLevels: [],
    occupationSecondLevels: [],
    published: undefined,
    sector: [],
    sort: ''
};

/**
 * Holder oversikt over de søkekriteriene bruker har valgt.
 */
export default function searchQueryReducer(state = initialState, action) {
    switch (action.type) {
        case RESET_SEARCH:
            return initialState;
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            return {
                ...state,
                from: 0,
                to: action.query.to ? parseInt(action.query.to, 10) : PAGE_SIZE,
                q: action.query.q || '',
                counties: action.query.counties || [],
                countries: action.query.countries || [],
                engagementType: action.query.engagementType || [],
                extent: action.query.extent || [],
                municipals: action.query.municipals || [],
                occupationFirstLevels: action.query.occupationFirstLevels || [],
                occupationSecondLevels: action.query.occupationSecondLevels || [],
                published: action.query.published,
                sector: action.query.sector || [],
                sort: action.query.sort || ''
            };
        case RESET_PAGINATION:
            return {
                ...state,
                from: 0,
                to: PAGE_SIZE
            };
        case ADD_COUNTY:
            return {
                ...state,
                counties: [...state.counties, action.county]
            };
        case REMOVE_COUNTY:
            return {
                ...state,
                counties: state.counties.filter((obj) => (obj !== action.county)),
                municipals: state.municipals.filter((obj) => (!obj.startsWith(`${action.county}.`)))
            };
        case ADD_MUNICIPAL:
            return {
                ...state,
                municipals: [...state.municipals, action.municipal]
            };
        case REMOVE_MUNICIPAL:
            return {
                ...state,
                municipals: state.municipals.filter((obj) => (obj !== action.municipal))
            };
        case ADD_COUNTRY:
            return {
                ...state,
                countries: [...state.countries, action.value]
            };
        case REMOVE_COUNTRY:
            return {
                ...state,
                countries: state.countries.filter((obj) => (obj !== action.value))
            };
        case ADD_OCCUPATION_FIRST_LEVEL:
            return {
                ...state,
                occupationFirstLevels: [...state.occupationFirstLevels, action.firstLevel]
            };
        case REMOVE_OCCUPATION_FIRST_LEVEL:
            return {
                ...state,
                occupationFirstLevels: state.occupationFirstLevels.filter((obj) => (obj !== action.firstLevel)),
                occupationSecondLevels: state.occupationSecondLevels.filter((obj) => (!obj.startsWith(`${action.firstLevel}.`)))
            };
        case ADD_OCCUPATION_SECOND_LEVEL:
            return {
                ...state,
                occupationSecondLevels: [...state.occupationSecondLevels, action.secondLevel]
            };
        case REMOVE_OCCUPATION_SECOND_LEVEL:
            return {
                ...state,
                occupationSecondLevels: state.occupationSecondLevels.filter((obj) => (obj !== action.secondLevel))
            };
        case ADD_ENGAGEMENT_TYPE:
            return {
                ...state,
                engagementType: [...state.engagementType, action.value]
            };
        case REMOVE_ENGAGEMENT_TYPE:
            return {
                ...state,
                engagementType: state.engagementType.filter((obj) => (obj !== action.value))
            };
        case ADD_EXTENT:
            return {
                ...state,
                extent: [...state.extent, action.value]
            };
        case REMOVE_EXTENT:
            return {
                ...state,
                extent: state.extent.filter((obj) => (obj !== action.value))
            };
        case ADD_SECTOR:
            return {
                ...state,
                sector: [...state.sector, action.value]
            };
        case REMOVE_SECTOR:
            return {
                ...state,
                sector: state.sector.filter((obj) => (obj !== action.value))
            };
        case SET_PUBLISHED:
            return {
                ...state,
                published: action.value
            };
        case SET_SEARCH_STRING:
            return {
                ...state,
                q: action.value
            };
        case SET_SORTING:
            return {
                ...state,
                sort: action.sortField
            };
        case LOAD_MORE:
            return {
                ...state,
                from: state.to,
                to: state.to + PAGE_SIZE
            };
        default:
            return state;
    }
}

/**
 * Takes an object an return a new object without empty properties.
 * An empty property can be a undefined value, an empty string or an empty array.
 * @param obj
 */
function removeEmptyProperties(obj) {
    const newObj = {};
    Object.keys(obj).forEach((prop) => {
        const value = obj[prop];
        if (Array.isArray(value)) {
            if (value.length > 0) {
                newObj[prop] = value;
            }
        } else if (value !== undefined && value !== '') {
            newObj[prop] = value;
        }
    });
    return newObj;
}

/**
 * Returnerer searchQuery optimimalisert for browser url'en
 * @param searchQuery
 */
export function toBrowserSearchQuery(searchQuery) {
    const browserSearchQuery = {
        ...searchQuery
    };

    // Man trenger ikke vise 'to' i browser url før man har
    // lastet inn flere annonser enn de aller første
    if (searchQuery.to <= PAGE_SIZE) {
        delete browserSearchQuery.to;
    }

    delete browserSearchQuery.from;

    return removeEmptyProperties(browserSearchQuery);
}

/**
 * Returnerer searchQuery optimimalisert for backend api-kall
 * @param searchQuery
 */
export function toApiSearchQuery(searchQuery) {
    const apiSearchQuery = {
        size: PAGE_SIZE,
        ...searchQuery
    };
    if (searchQuery.to > PAGE_SIZE) {
        apiSearchQuery.size = searchQuery.to - searchQuery.from;
    }

    delete apiSearchQuery.to;

    return removeEmptyProperties(apiSearchQuery);
}

/**
 * Returnerer searchQuery optimimalisert for lagrede søk
 * @param searchQuery
 */
export function toSavedSearchQuery(searchQuery) {
    const savedSearchQuery = {
        ...searchQuery
    };

    // Når man lagrer et søk dropper vi paginering og sortering
    delete savedSearchQuery.to;
    delete savedSearchQuery.from;
    delete savedSearchQuery.sort;

    return removeEmptyProperties(savedSearchQuery);
}

/**
 * Returnerer searchQuery som en komma-separert og lesbar tekst.
 * For example: "Oslo, Hordaland, IT, Nye i dag"
 * @param searchQuery
 * @returns {string}
 */
export function toReadableSearchQuery(searchQuery) {
    const title = [];

    // Ikke vis fylke hvis bruker har valgt en kommune i samme fylke
    const counties = searchQuery.counties.filter((county) => {
        const found = searchQuery.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });

    // Ikke vis yrke på nivå 1 hvis bruker har valgt et relatert yrke på nivå 2
    const occupationFirstLevels = searchQuery.occupationFirstLevels.filter((firstLevel) => {
        const found = searchQuery.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });

    if (searchQuery.q) title.push(searchQuery.q);
    if (occupationFirstLevels.length > 0) title.push(occupationFirstLevels.join(', '));
    if (searchQuery.occupationSecondLevels.length > 0) title.push(searchQuery.occupationSecondLevels.map((o) => (o.split('.')[1])).join(', '));
    if (counties.length > 0) title.push(counties.map((c) => (capitalizeLocation(c))).join(', '));
    if (searchQuery.municipals.length > 0) title.push(searchQuery.municipals.map((m) => (capitalizeLocation(m.split('.')[1]))).join(', '));
    if (searchQuery.extent.length > 0) title.push(searchQuery.extent.join(', '));
    if (searchQuery.engagementType.length > 0) title.push(searchQuery.engagementType.join(', '));
    if (searchQuery.sector.length > 0) title.push(searchQuery.sector.join(', '));
    if (searchQuery.countries.length > 0) title.push(searchQuery.countries.map((c) => (capitalizeLocation(c))).join(', '));
    if (searchQuery.published) title.push(PublishedLabelsEnum[searchQuery.published]);

    return title.join(', ');
}

/**
 * Sjekker om bruker av valgt et eller flere søkekriterier
 * @param searchQuery
 * @returns {boolean}
 */
export function isSearchQueryEmpty(searchQuery) {
    const queryWithoutEmptyProperties = removeEmptyProperties(searchQuery);
    return Object.keys(queryWithoutEmptyProperties).length === 0;
}

/**
 * Vi lagrer queryString til sessionStorage, slik at brukeren
 * skal kunne navigere vekk fra stillingssøket uten å miste det siste foretatte søket.
 * For ekspempel kan en bruker klikke seg videre til en annonse, og deretter åpne en lenke til f.eks. Finn.no.
 * Når bruker kommer tilbake til annonsesiden, kan han eller hun velge å trykke på "Til ledige stillinger" i stedet for
 * tilbakeknappen i browseren, det er da man trenger queryString fra sessionStorage.
 */
export function getLastSearchQueryFromSessionStorage() {
    const queryString = sessionStorage.getItem(LATEST_QUERY_STRING_KEY);
    return queryString ? queryString : '';
}

/**
 * Når bruker gjør endinger i søket, så må vi oppdatere url'en i nettleserens adressefelt.
 * Vi lagrer også search query i sessionStorage
 * @see getLastSearchQueryFromSessionStorage
 */
function* synchronizeBrowserUrl() {
    const state = yield select();
    const browserSearchQuery = toBrowserSearchQuery(state.searchQuery);

    if (state.savedSearches.currentSavedSearch) {
        browserSearchQuery.saved = state.savedSearches.currentSavedSearch.uuid;
    }

    const queryString = toQueryString(browserSearchQuery);
    window.history.replaceState({}, '', CONTEXT_PATH + queryString);
    sessionStorage.setItem(LATEST_QUERY_STRING_KEY, queryString);
}

/**
 * Hvis bruker åpner en lenke med søkeparametere eller bare refresher browseren, så skal dette søket gjenskapes.
 */
function* restoreStateFromBrowserUrl() {
    let url = document.location.search;
    sessionStorage.setItem(LATEST_QUERY_STRING_KEY, url);

    // Dekoder en url til den ikke lenger er kodet.
    // En kodet url er i dette tilfellet en url som inneholder '%'.
    let decodedUrl = url;
    while (decodedUrl.includes('%')) {
        decodedUrl = decodeURIComponent(decodedUrl);
    }

    yield put({ type: RESTORE_STATE_FROM_URL, query: toObject(decodedUrl) });
}

export const searchQuerySaga = function* saga() {
    yield takeLatest([
        SEARCH,
        RESET_SEARCH,
        SET_CURRENT_SAVED_SEARCH,
        ADD_SAVED_SEARCH_SUCCESS,
        LOAD_MORE
    ], synchronizeBrowserUrl);
    yield takeLatest(RESTORE_STATE_FROM_URL_BEGIN, restoreStateFromBrowserUrl);
};
