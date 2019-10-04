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
    SET_PUBLISHED,
    SET_SEARCH_STRING, SET_SORTING
} from './search/searchQueryReducer';
import { SEARCH } from './search/searchReducer';
import { sortingValueToLabel } from './search/sorting/Sorting';

const LEDIGE_STILLINGER_UNIQUE_EVENTS = 'Ledige stillinger (Unike hendelser)';
const ignoreFurther = [];

function track(...props) {
    console.log(...props);
    if (window.ga) {
        window.ga(...props);
    }
}

function trackOnce(...props) {
    const key = props.join();
    if(!ignoreFurther.includes(key)) {
        ignoreFurther.push(key);
        track(...props);
    }
}

export const analyticsSaga = function* saga() {
    yield takeEvery(ADD_TO_FAVOURITES_SUCCESS, () => {
        track('send', 'event', 'Favoritter', 'La til favoritt');
    });

    yield takeEvery(REMOVE_FROM_FAVOURITES_SUCCESS, () => {
        track('send', 'event', 'Favoritter', 'Slettet favoritt');
    });

    yield takeEvery(ADD_SAVED_SEARCH_SUCCESS, () => {
        track('send', 'event', 'Lagrede søk', 'La til lagret søk');
    });

    yield takeEvery(SEARCH, () => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Utførte søk');
    });

    yield takeEvery(SET_SEARCH_STRING, () => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret fritekst');
    });

    yield takeEvery(ADD_OCCUPATION_FIRST_LEVEL, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte yrke nivå 1', action.firstLevel);
    });

    yield takeEvery(ADD_OCCUPATION_SECOND_LEVEL, (action) => {
        let label;
        const fragments = action.secondLevel.split('.');
        if(fragments.length === 2) {
            label = `${fragments[1]} (${fragments[0]})` // F. eks "Utvikling (IT)"
        } else {
            label = action.secondLevel;
        }

        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte yrke nivå 2', label);
    });

    yield takeEvery(ADD_COUNTRY, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte land', fixLocationName(action.value));
    });

    yield takeEvery(ADD_COUNTY, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte fylke', fixLocationName(action.county));
    });

    yield takeEvery(ADD_MUNICIPAL, (action) => {
        let label;
        const fragments = action.municipal.split('.');
        if(fragments.length === 2) {
            label = `${fixLocationName(fragments[1])} (${fixLocationName(fragments[0])})` // F. eks "Asker (Akershus)"
        } else {
            label = action.municipal;
        }
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte kommune', label);
    });

    yield takeEvery(SET_PUBLISHED, (action) => {
        if(action.value !== undefined) {
            trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte publisert', PublishedLabelsEnum[action.value]);
        }
    });

    yield takeEvery(ADD_EXTENT, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte heltid/deltid', action.value);
    });

    yield takeEvery(ADD_SECTOR, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte sektor', action.value);
    });

    yield takeEvery(ADD_ENGAGEMENT_TYPE, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Valgte ansettelsesform', action.value);
    });

    yield takeEvery(SET_SORTING, (action) => {
        trackOnce('send', 'event', LEDIGE_STILLINGER_UNIQUE_EVENTS, 'Endret sortering', sortingValueToLabel(action.sortField));
    });
};
