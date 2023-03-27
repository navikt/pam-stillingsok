import React from "react";
import { Accordion } from "@navikt/ds-react";
import Counties from "./filters/Locations";
import EngagementType from "./filters/Engagement";
import Extent from "./filters/Extent";
import Occupations from "./filters/Occupations";
import Published from "./filters/Published";
import Sector from "./filters/Sector";
import SearchBox from "./SearchBox";
import SaveSearchButton from "../../../saved-searches/components/SaveSearchButton";
import ResetButton from "./ResetButton";
import SkipToResult from "../skiplinks/SkipToResult";

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
        <React.Fragment>
            <form id="sok" className="Search__form" onSubmit={submitForm} role="search">
                <SkipToResult data={searchResult} />
                <h2 className="Search__h2">Søk</h2>
                <SearchBox query={query} dispatch={dispatchQuery} />
                <Accordion>
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
                </Accordion>
            </form>
            <div className="Search__reset-and-save-search">
                <SaveSearchButton query={query} />
                <ResetButton dispatch={dispatchQuery} />
            </div>
        </React.Fragment>
    );
};

export default SearchForm;
