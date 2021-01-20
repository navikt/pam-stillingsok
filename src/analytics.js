import { takeEvery } from 'redux-saga/effects';
import fixLocationName from '../server/common/fixLocationName';
import { ADD_TO_FAVOURITES_SUCCESS, REMOVE_FROM_FAVOURITES_SUCCESS } from './favourites/favouritesReducer';
import { ADD_SAVED_SEARCH_SUCCESS } from './savedSearches/savedSearchesReducer';
import { PublishedLabelsEnum } from './search/facets/Published';
import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_ENGAGEMENT_TYPE,
    ADD_EXTENT,
    ADD_MUNICIPAL,
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    ADD_SECTOR,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_ENGAGEMENT_TYPE,
    REMOVE_EXTENT,
    REMOVE_MUNICIPAL, REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    REMOVE_SECTOR,
    SET_PUBLISHED,
    SET_SEARCH_STRING,
    SET_SORTING
} from './search/searchQueryReducer';
import { LOAD_MORE, SEARCH } from './search/searchReducer';
import { sortingValueToLabel } from './search/sorting/Sorting';

const EVENT_CATEGORY_SEARCH = 'Ledige stillinger > Søk';
const EVENT_CATEGORY_FAVOURITES = 'Ledige stillinger > Favoritter';
export const EVENT_CATEGORY_SAVED_SEARCHES = 'Ledige stillinger > Lagrede søk';
const ignoreFurther = [];

function track(...props) {
    try {
        if (window.ga) {
            window.ga(...props);
        }
    } catch (e) {
        // ignore ga error
    }
}

export function trackOnce(...props) {
    const key = props.join();
    if(!ignoreFurther.includes(key)) {
        ignoreFurther.push(key);
        track('send', 'event', ...props);
    }
}

export const analyticsSaga = function* saga() {
    yield takeEvery(ADD_TO_FAVOURITES_SUCCESS, () => {
        track('send', 'event', EVENT_CATEGORY_FAVOURITES, 'La til favoritt');
    });

    yield takeEvery(REMOVE_FROM_FAVOURITES_SUCCESS, () => {
        track('send', 'event', EVENT_CATEGORY_FAVOURITES, 'Slettet favoritt');
    });

    yield takeEvery(ADD_SAVED_SEARCH_SUCCESS, () => {
        track('send', 'event', EVENT_CATEGORY_SAVED_SEARCHES, 'La til lagret søk');
    });

    yield takeEvery(SEARCH, () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Utførte søk');
    });

    yield takeEvery(SET_SEARCH_STRING, () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Fritekstfelt');
    });

    yield takeEvery([ADD_OCCUPATION_FIRST_LEVEL, REMOVE_OCCUPATION_FIRST_LEVEL], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Yrke');
    });

    yield takeEvery(ADD_OCCUPATION_FIRST_LEVEL, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte yrkesnivå 1', action.firstLevel);
    });

    yield takeEvery([ADD_OCCUPATION_SECOND_LEVEL, REMOVE_OCCUPATION_SECOND_LEVEL], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Yrke');
    });

    yield takeEvery(ADD_OCCUPATION_SECOND_LEVEL, (action) => {
        let label;
        const fragments = action.secondLevel.split('.');
        if(fragments.length === 2) {
            label = `${fragments[1]} (${fragments[0]})` // F. eks "Utvikling (IT)"
        } else {
            label = action.secondLevel;
        }

        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte yrkesnivå 2', label);
    });

    yield takeEvery([ADD_COUNTRY, REMOVE_COUNTRY], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Land');
    });

    yield takeEvery(ADD_COUNTRY, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte land', fixLocationName(action.value));
    });

    yield takeEvery([ADD_COUNTY, REMOVE_COUNTY], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Område');
    });

    yield takeEvery(ADD_COUNTY, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte fylke', fixLocationName(action.county));
        if (action.county.toLowerCase() === 'oslo') {
            trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte kommune', fixLocationName(action.county));
        }
    });

    yield takeEvery([ADD_MUNICIPAL, REMOVE_MUNICIPAL], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Område');
    });

    yield takeEvery(ADD_MUNICIPAL, (action) => {
        let label;
        const fragments = action.municipal.split('.');
        if(fragments.length === 2) {
            label = `${fixLocationName(fragments[1])} (${fixLocationName(fragments[0])})` // F. eks "Asker (Akershus)"
        } else {
            label = action.municipal;
        }
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte kommune', label);
    });

    yield takeEvery(SET_PUBLISHED, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Publisert');
        if(action.value !== undefined) {
            trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte publisert', PublishedLabelsEnum[action.value]);
        }
    });

    yield takeEvery([ADD_EXTENT, REMOVE_EXTENT], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Heltid/deltid');
    });

    yield takeEvery(ADD_EXTENT, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte heltid/deltid', action.value);
    });

    yield takeEvery([ADD_SECTOR, REMOVE_SECTOR], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Sektor');
    });

    yield takeEvery(ADD_SECTOR, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte sektor', action.value);
    });

    yield takeEvery([ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE], (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Ansettelsesform');
    });

    yield takeEvery(ADD_ENGAGEMENT_TYPE, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Valgte ansettelsesform', action.value);
    });

    yield takeEvery(SET_SORTING, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret sortering', sortingValueToLabel(action.sortField));
    });

    yield takeEvery(LOAD_MORE, (action) => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret paginering');
    });
};
