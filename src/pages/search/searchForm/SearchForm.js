import React from "react";
import Counties from "./Locations";
import EngagementType from "./Engagement";
import Extent from "./Extent";
import Occupations from "./Occupations";
import Published from "./Published";
import Sector from "./Sector";
import SearchBox from "./SearchBox";
import SaveSearchButton from "../../savedSearches/SaveSearchButton";
import ResetButton from "../resetButton/ResetButton";

const SearchForm = ({ fetchSearch, query, dispatchQuery, initialSearchResult, searchResult }) => {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    return (
        <form id="sok" onSubmit={submitForm} role="search">
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
                initialValues={initialSearchResult.aggregations.occupationFirstLevels}
                updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
            />
            <Published
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.aggregations.published}
                updatedValues={searchResult && searchResult.aggregations.published}
            />
            <Extent
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.aggregations.extent}
                updatedValues={searchResult && searchResult.aggregations.extent}
            />
            <EngagementType
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.aggregations.engagementTypes}
                updatedValues={searchResult && searchResult.aggregations.engagementTypes}
            />
            <Sector
                query={query}
                dispatch={dispatchQuery}
                initialValues={initialSearchResult.aggregations.sector}
                updatedValues={searchResult && searchResult.aggregations.sector}
            />

            <div className="Search__reset-and-save-search">
                <SaveSearchButton query={query} />
                <ResetButton dispatch={dispatchQuery} />
            </div>
        </form>
    );
};

export default SearchForm;
