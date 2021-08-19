import { isMobile } from '../../utils';
import { select, takeLatest } from 'redux-saga/effects';

export const EXPAND_ALL_FACET_PANELS = 'EXPAND_ALL_FACET_PANELS';
export const COLLAPSE_ALL_FACET_PANELS = 'COLLAPSE_ALL_FACET_PANELS';
export const EXPAND_FACET_PANEL = 'EXPAND_FACET_PANEL';
export const COLLAPSE_FACET_PANEL = 'COLLAPSE_FACET_PANEL';

export const SearchCriteriaPanels = {
    ENGAGEMENT_TYPE_PANEL: 'ENGAGEMENT_TYPE_PANEL',
    EXTENT_PANEL: 'EXTENT_PANEL',
    COUNTIES_PANEL: 'COUNTIES_PANEL',
    COUNTRIES_PANEL: 'COUNTRIES_PANEL',
    OCCUPATIONS_PANEL: 'OCCUPATIONS_PANEL',
    PUBLISHED_PANEL: 'PUBLISHED_PANEL',
    SECTOR_PANEL: 'SECTOR_PANEL'
};

function getDefaultExpandedPanels() {
    if(isMobile()) {
        return [];
    }
    return [
        SearchCriteriaPanels.COUNTIES_PANEL,
        SearchCriteriaPanels.COUNTRIES_PANEL,
        SearchCriteriaPanels.OCCUPATIONS_PANEL,
        SearchCriteriaPanels.PUBLISHED_PANEL
    ];
}

/**
 * Husker hvilke av panelene som er åpne, slik de forblir åpnet
 * når bruker kommer tilbake fra en ekstern side eller refresher nettsiden.
 */
function* rememberWhichPanelsAreExpanded() {
    const state = yield select();
    const expandedFacetPanels = state.facetPanels.expandedFacetPanels;

    try  {
        sessionStorage.setItem('expandedFacetPanels', expandedFacetPanels.join(','));
    } catch (e) {
        // ignore session storage error
    }
}

function restoreExpandedPanels() {
    try  {
        const valueFromSessionStorage = sessionStorage.getItem('expandedFacetPanels');
        if (valueFromSessionStorage !== null) {
            const valuesAsArray = valueFromSessionStorage.split(',');
            const allowedValues = valuesAsArray.filter((p) => SearchCriteriaPanels[p] !== undefined);
            return allowedValues;
        } else {
            return getDefaultExpandedPanels();
        }
    } catch (e) {
        return getDefaultExpandedPanels();
    }
}

const initialState = {
    expandedFacetPanels: restoreExpandedPanels()
};

/**
 * Holder oversikt over hvilke av panelene med søkekriterier som er åpne/lukket.
 */
export default function facetPanelsReducer(state = initialState, action) {
    switch (action.type) {
        case EXPAND_FACET_PANEL:
            return {
                ...state,
                expandedFacetPanels: [...state.expandedFacetPanels, action.panelId]
            };
        case COLLAPSE_FACET_PANEL:
            return {
                ...state,
                expandedFacetPanels: state.expandedFacetPanels.filter((p) => p !== action.panelId)
            };
        case EXPAND_ALL_FACET_PANELS:
            return {
                ...state,
                expandedFacetPanels: initialState.expandedFacetPanels
            };
        case COLLAPSE_ALL_FACET_PANELS:
            return {
                ...state,
                expandedFacetPanels: []
            };
        default:
            return state;
    }
}

export const facetPanelsSaga = function* saga() {
    yield takeLatest([EXPAND_FACET_PANEL, COLLAPSE_FACET_PANEL], rememberWhichPanelsAreExpanded);
};
