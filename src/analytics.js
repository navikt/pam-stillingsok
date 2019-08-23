import { takeEvery } from 'redux-saga/es/effects';
import { FETCH_IS_AUTHENTICATED_FAILURE, FETCH_IS_AUTHENTICATED_SUCCESS } from './authentication/authenticationReducer';
import { FETCH_FAVOURITES_SUCCESS } from './favourites/favouritesReducer';
import { COLLAPSE_FACET_PANEL, EXPAND_FACET_PANEL } from './search/facets/facetPanelsReducer';

function analytics(...props) {
    console.log(props)
    if (window.ga) {
        window.ga(...props);
    }
}

function trackAuthenticationStatus(action) {
    analytics('send', 'event', 'Authentication', 'status', action.isAuthenticated ? 'innlogget': 'ikke-innlogget');
}

function trackAuthenticationFailure() {
    analytics('send', 'event', 'Authentication', 'status', 'feilet');
}

/**
 * Viser om innlogget bruker har valgt "arbeidsgiver" eller "personbruker" når de logget inn.
 * Hvis bruker allerede er innlogget, f.eks på nav.no, vet vi ikke rollen enda ("ukjent").
 */
function trackAuthenticationRole(action) {
    if(action.isAuthenticated) {
        analytics('send', 'event', 'Authentication', 'role', localStorage.getItem('innloggetBrukerKontekst') || 'ukjent');
    }
}

/**
 * Vi ønsker å vite hvor mange favoritter det er vanlig å ha. Og så vil vi gjerne
 * vite om det er noen brukere som har veldig mange favoritter, og om vi bør innføre paging eller
 * opprydding av gamle favoritter.
 * @param total
 */
function trackTotalFavourites(action) {
    analytics('send', 'event', 'Favoritter', 'fetchTotalElements', action.response.totalElements);
}

/**
 * Viser hvor mange bruker print-knappen på stillingsiden.
 */
export function trackStillingPrint() {
    analytics('send', 'event', 'Stilling', 'print');
}

function trackExpandFacetPanel(action) {
    analytics('send', 'event', 'Facet', 'expand', action.panelId);
}

function trackCollapseFacetPanel(action) {
    analytics('send', 'event', 'Facet', 'collapse', action.panelId);
}

export const analyticsSaga = function* saga() {
    yield takeEvery(FETCH_IS_AUTHENTICATED_SUCCESS, trackAuthenticationStatus);
    yield takeEvery(FETCH_IS_AUTHENTICATED_SUCCESS, trackAuthenticationRole);
    yield takeEvery(FETCH_IS_AUTHENTICATED_FAILURE, trackAuthenticationFailure);
    yield takeEvery(FETCH_FAVOURITES_SUCCESS, trackTotalFavourites);
    yield takeEvery(EXPAND_FACET_PANEL, trackExpandFacetPanel);
    yield takeEvery(COLLAPSE_FACET_PANEL, trackCollapseFacetPanel);
};
