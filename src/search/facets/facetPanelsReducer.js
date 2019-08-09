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

const initialState = {
    expandedFacetPanels: [
        SearchCriteriaPanels.ENGAGEMENT_TYPE_PANEL,
        SearchCriteriaPanels.EXTENT_PANEL,
        SearchCriteriaPanels.COUNTIES_PANEL,
        SearchCriteriaPanels.COUNTRIES_PANEL,
        SearchCriteriaPanels.OCCUPATIONS_PANEL,
        SearchCriteriaPanels.PUBLISHED_PANEL,
        SearchCriteriaPanels.SECTOR_PANEL
    ],
};

/**
 * Holder oversikt over hvilke av panelene med søkekriterier som er åpne/lukket.
 */
export default function facetPanelsReducer(state = initialState, action) {
    switch (action.type) {
        case EXPAND_FACET_PANEL:
            return {
                ...state,
                expandedFacetPanels: [...state, action.panelId]
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
