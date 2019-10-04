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

const FIRST_INTERACTION = 'Ledige stillinger - Første interaksjon';
const FACET_USAGE = 'Ledige stillinger - Bruk av søkekriterier';
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
        trackOnce('send', 'event', FIRST_INTERACTION, 'Utførte søk første gang');
    });

    yield takeEvery(SET_SEARCH_STRING, () => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Endret fritekst første gang');
    });

    yield takeEvery([ADD_OCCUPATION_FIRST_LEVEL, REMOVE_OCCUPATION_FIRST_LEVEL], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte yrke første gang');
    });

    yield takeEvery(ADD_OCCUPATION_FIRST_LEVEL, (action) => {
        trackOnce('send', 'event', FACET_USAGE, 'Valgte yrkesnivå 1', action.firstLevel);
    });

    yield takeEvery([ADD_OCCUPATION_SECOND_LEVEL, REMOVE_OCCUPATION_SECOND_LEVEL], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte yrke første gang');
    });

    yield takeEvery(ADD_OCCUPATION_SECOND_LEVEL, (action) => {
        let label;
        const fragments = action.secondLevel.split('.');
        if(fragments.length === 2) {
            label = `${fragments[1]} (${fragments[0]})` // F. eks "Utvikling (IT)"
        } else {
            label = action.secondLevel;
        }

        trackOnce('send', 'event', FACET_USAGE, 'Valgte yrkesnivå 2', label);
    });

    yield takeEvery([ADD_COUNTRY, REMOVE_COUNTRY], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte land første gang');
    });

    yield takeEvery(ADD_COUNTRY, (action) => {
        trackOnce('send', 'event', FACET_USAGE, 'Valgte land', fixLocationName(action.value));
    });

    yield takeEvery([ADD_COUNTY, REMOVE_COUNTY], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte område første gang');
    });

    yield takeEvery(ADD_COUNTY, (action) => {
        trackOnce('send', 'event', FACET_USAGE, 'Valgte fylke', fixLocationName(action.county));
    });

    yield takeEvery([ADD_MUNICIPAL, REMOVE_MUNICIPAL], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte område første gang');
    });

    yield takeEvery(ADD_MUNICIPAL, (action) => {
        let label;
        const fragments = action.municipal.split('.');
        if(fragments.length === 2) {
            label = `${fixLocationName(fragments[1])} (${fixLocationName(fragments[0])})` // F. eks "Asker (Akershus)"
        } else {
            label = action.municipal;
        }
        trackOnce('send', 'event', FACET_USAGE, 'Valgte kommune', label);
    });

    yield takeEvery(SET_PUBLISHED, (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte publisert første gang');
        if(action.value !== undefined) {
            trackOnce('send', 'event', FACET_USAGE, 'Valgte publisert', PublishedLabelsEnum[action.value]);
        }
    });

    yield takeEvery([ADD_EXTENT, REMOVE_EXTENT], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte heltid/deltid første gang');
    });

    yield takeEvery(ADD_EXTENT, (action) => {
        trackOnce('send', 'event', FACET_USAGE, 'Valgte heltid/deltid', action.value);
    });

    yield takeEvery([ADD_SECTOR, REMOVE_SECTOR], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte sektor første gang');
    });

    yield takeEvery(ADD_SECTOR, (action) => {
        trackOnce('send', 'event', FACET_USAGE, 'Valgte sektor', action.value);
    });

    yield takeEvery([ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE], (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Valgte ansettelsesform første gang');
    });

    yield takeEvery(ADD_ENGAGEMENT_TYPE, (action) => {
        trackOnce('send', 'event', FACET_USAGE, 'Valgte ansettelsesform', action.value);
    });

    yield takeEvery(SET_SORTING, (action) => {
        trackOnce('send', 'event', FIRST_INTERACTION, 'Endret sortering første gang');
        trackOnce('send', 'event', FACET_USAGE, 'Endret sortering', sortingValueToLabel(action.sortField));
    });
};
