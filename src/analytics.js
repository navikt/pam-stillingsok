import { takeEvery } from 'redux-saga/es/effects';
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
import { SEARCH } from './search/searchReducer';
import { sortingValueToLabel } from './search/sorting/Sorting';

const LEDIGE_STILLINGER_UNIQUE_EVENTS = 'Ledige stillinger > Unike hendelser';
const LEDIGE_STILLINGER_FAVOURITES = 'Ledige stillinger > Favoritter';
const LEDIGE_STILLINGER_SAVED_SEARCHES = 'Ledige stillinger > Lagrede søk';
const ignoreFurther = [];

function track(...props) {
    if (window.ga) {
        window.ga(...props);
    }
}

function trackOnce(...props) {
    const key = props.join();
    if(!ignoreFurther.includes(key)) {
        ignoreFurther.push(key);
        track('send', 'event', ...props);
    }
}

export const analyticsSaga = function* saga() {
    yield takeEvery(ADD_TO_FAVOURITES_SUCCESS, () => {
        track('send', 'event', LEDIGE_STILLINGER_FAVOURITES, 'La til favoritt');
    });

    yield takeEvery(REMOVE_FROM_FAVOURITES_SUCCESS, () => {
        track('send', 'event', LEDIGE_STILLINGER_FAVOURITES, 'Slettet favoritt');
    });

    yield takeEvery(ADD_SAVED_SEARCH_SUCCESS, () => {
        track('send', 'event', LEDIGE_STILLINGER_SAVED_SEARCHES, 'La til lagret søk');
    });

    yield takeEvery(SEARCH, () => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Utførte søk');
    });

    yield takeEvery(SET_SEARCH_STRING, () => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Fritekstfelt');
    });

    yield takeEvery([ADD_OCCUPATION_FIRST_LEVEL, REMOVE_OCCUPATION_FIRST_LEVEL], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Yrke');
    });

    yield takeEvery(ADD_OCCUPATION_FIRST_LEVEL, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte yrkesnivå 1', action.firstLevel);
    });

    yield takeEvery([ADD_OCCUPATION_SECOND_LEVEL, REMOVE_OCCUPATION_SECOND_LEVEL], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Yrke');
    });

    yield takeEvery(ADD_OCCUPATION_SECOND_LEVEL, (action) => {
        let label;
        const fragments = action.secondLevel.split('.');
        if(fragments.length === 2) {
            label = `${fragments[1]} (${fragments[0]})` // F. eks "Utvikling (IT)"
        } else {
            label = action.secondLevel;
        }

        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte yrkesnivå 2', label);
    });

    yield takeEvery([ADD_COUNTRY, REMOVE_COUNTRY], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Land');
    });

    yield takeEvery(ADD_COUNTRY, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte land', fixLocationName(action.value));
    });

    yield takeEvery([ADD_COUNTY, REMOVE_COUNTY], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Område');
    });

    yield takeEvery(ADD_COUNTY, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte fylke', fixLocationName(action.county));
    });

    yield takeEvery([ADD_MUNICIPAL, REMOVE_MUNICIPAL], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Område');
    });

    yield takeEvery(ADD_MUNICIPAL, (action) => {
        let label;
        const fragments = action.municipal.split('.');
        if(fragments.length === 2) {
            label = `${fixLocationName(fragments[1])} (${fixLocationName(fragments[0])})` // F. eks "Asker (Akershus)"
        } else {
            label = action.municipal;
        }
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte kommune', label);
    });

    yield takeEvery(SET_PUBLISHED, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Publisert');
        if(action.value !== undefined) {
            trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte publisert', PublishedLabelsEnum[action.value]);
        }
    });

    yield takeEvery([ADD_EXTENT, REMOVE_EXTENT], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Heltid/deltid');
    });

    yield takeEvery(ADD_EXTENT, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte heltid/deltid', action.value);
    });

    yield takeEvery([ADD_SECTOR, REMOVE_SECTOR], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Sektor');
    });

    yield takeEvery(ADD_SECTOR, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte sektor', action.value);
    });

    yield takeEvery([ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE], (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriterie', 'Ansettelsesform');
    });

    yield takeEvery(ADD_ENGAGEMENT_TYPE, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte ansettelsesform', action.value);
    });

    yield takeEvery(SET_SORTING, (action) => {
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret søkekriter', 'Sortér etter');
        trackOnce(LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret sortering', sortingValueToLabel(action.sortField));
    });
};
