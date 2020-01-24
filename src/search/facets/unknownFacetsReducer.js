import { put, select, takeLatest } from 'redux-saga/es/effects';
import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../searchQueryReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH } from '../searchReducer';

const SET_UNKNOWN_FACETS = 'SET_UNKNOWN_FACETS';

const initialState = {
    unknownCounties: [],
    unknownMunicipals: [],
    unknownCountries: [],
    unknownEngagementTypes: [],
    unknownExtents: [],
    unknownOccupationFirstLevels: [],
    unknownOccupationSecondLevels: [],
    unknownSectors: [],
};

/**
 * Oversikten over mulige fasetter lages dynamisk av backend, basert på de stillingene som finnes nå.
 * Hvilke fasetter som er tilgjengelige vil derfor variere over tid.
 * F.eks hvis det ikke finnes ledige stilinger med ansetteleseform "Sesong" akkuratt nå, vil heller
 * ikke dette være en mulig fasettverdi. Bruker kan likevel åpne et lagret søk, eller en gammel
 * lenke/bokmerke med '&engagementType=Sesong'.
 *
 * Denne reduceren holder derfor oversikt over ukjente fasettverdier som er i bruk, men som ikke vil gi treff.
 */
export default function unknownFacetsReducer(state = initialState, action) {
    switch (action.type) {
        case RESET_SEARCH:
            return initialState;
        case SET_UNKNOWN_FACETS:
            return {
                ...state,
                ...action.unknownValues
            };
        default:
            return state;
    }
}

/**
 * Returnerer en liste med ukjente fasettverdier.
 * @param usersSearchCriteria: De fasettverdiene som bruker har valgt
 * @param searchCriteriaFromBackend: Tilgjengelig fasettverdier fra backend
 * @param nestedName, f.eks 'municipals'.
 */
export function findUnknownFacets(usersSearchCriteria, searchCriteriaFromBackend, nestedName) {
    return usersSearchCriteria.filter((used) => {
        if (searchCriteriaFromBackend === undefined) return true;

        const found = searchCriteriaFromBackend.find((knownValue) => {
            if (nestedName !== undefined && knownValue[nestedName]) {
                return knownValue[nestedName].find((nested) => used === nested.key);
            }
            return used === knownValue.key;
        });
        return found === undefined;
    });
}

/**
 * Finner ukjente fasettverdier etter at vi har fått alle tilgjengelige fasetter fra backend.
 */
function* handleFetchInitialFacetsSuccess(action) {
    const state = yield select();

    yield put({
        type: SET_UNKNOWN_FACETS,
        unknownValues: {
            unknownOccupationFirstLevels: findUnknownFacets(state.searchQuery.occupationFirstLevels, action.response.occupationFirstLevels),
            unknownOccupationSecondLevels: findUnknownFacets(state.searchQuery.occupationSecondLevels, action.response.occupationFirstLevels, 'occupationSecondLevels'),
            unknownCounties: findUnknownFacets(state.searchQuery.counties, action.response.counties),
            unknownMunicipals: findUnknownFacets(state.searchQuery.municipals, action.response.counties, 'municipals'),
            unknownCountries: findUnknownFacets(state.searchQuery.countries, action.response.countries),
            unknownEngagementTypes: findUnknownFacets(state.searchQuery.engagementType, action.response.engagementTypes),
            unknownExtents: findUnknownFacets(state.searchQuery.extent, action.response.extent),
            unknownSectors: findUnknownFacets(state.searchQuery.sector, action.response.sector)
        }
    });
}

/**
 * Finner ukjente fasettverdier etter bruker har åpnet et lagret søk.
 */
function* handleRestoreStateFromSavedSearch() {
    const state = yield select();

    yield put({
        type: SET_UNKNOWN_FACETS,
        unknownValues: {
            unknownOccupationFirstLevels: findUnknownFacets(state.searchQuery.occupationFirstLevels, state.facets.occupationFirstLevelFacets),
            unknownOccupationSecondLevels: findUnknownFacets(state.searchQuery.occupationSecondLevels, state.facets.occupationFirstLevelFacets, 'occupationSecondLevels'),
            unknownCounties: findUnknownFacets(state.searchQuery.counties, state.facets.locationFacets),
            unknownMunicipals: findUnknownFacets(state.searchQuery.municipals, state.facets.locationFacets, 'municipals'),
            unknownEngagementTypes: findUnknownFacets(state.searchQuery.engagementType, state.facets.engagementTypeFacets),
            unknownExtents: findUnknownFacets(state.searchQuery.extent, state.facets.extentFacets),
            unknownSectors: findUnknownFacets(state.searchQuery.sector, state.facets.sectorFacets)
        }
    });
}

export const unknownFacetsSaga = function* saga() {
    yield takeLatest(FETCH_INITIAL_FACETS_SUCCESS, handleFetchInitialFacetsSuccess);
    yield takeLatest([RESTORE_STATE_FROM_URL, RESTORE_STATE_FROM_SAVED_SEARCH], handleRestoreStateFromSavedSearch);
};
