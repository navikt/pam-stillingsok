import React from "react";
import { CONTEXT_PATH } from "../../../environment";
import Counties from "./Locations";
import EngagementType from "./Engagement";
import Extent from "./Extent";
import Occupations from "./Occupations";
import Published from "./Published";
import Sector from "./Sector";
import SearchBox from "./SearchBox";
import SkipToResult from "../skiplinks/SkipToResult";
import SaveSearchButton from "../../savedSearches/SaveSearchButton";
import ResetButton from "../resetButton/ResetButton";

const SearchCriteria = ({ fetchSearch, query, dispatchQuery, initialSearchResult, searchResult }) => {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    return (
        <form id="sok" onSubmit={submitForm} role="search" aria-labelledby="search-form-title">
            <SkipToResult data={searchResult} />

            <h2 className="Search__form-title" id="search-form-title">
                Søk blant ledige stillinger
            </h2>
            <SearchBox query={query} dispatch={dispatchQuery} />
            <Counties
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult}
                updatedValues={searchResult}
            />
            <Occupations
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.occupationFirstLevels}
                updatedValues={searchResult && searchResult.occupationFirstLevels}
            />
            <Published
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.published}
                updatedValues={searchResult && searchResult.published}
            />
            <Extent
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.extent}
                updatedValues={searchResult && searchResult.extent}
            />
            <EngagementType
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.engagementTypes}
                updatedValues={searchResult && searchResult.engagementTypes}
            />
            <Sector
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.sector}
                updatedValues={searchResult && searchResult.sector}
            />

            <div className="Search__reset-and-save-search">
                <SaveSearchButton query={query} />
                <ResetButton dispatch={dispatchQuery} />
            </div>
        </form>
    );
};

export default SearchCriteria;
