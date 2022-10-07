import React from "react";
import Counties from "./filters/Locations";
import EngagementType from "./filters/Engagement";
import Extent from "./filters/Extent";
import Occupations from "./filters/Occupations";
import Published from "./filters/Published";
import Sector from "./filters/Sector";
import SearchBox from "./SearchBox";
import SaveSearchButton from "../../SavedSearces/SaveSearchButton";
import ResetButton from "./ResetButton";
import SkipToResult from "../skiplinks/SkipToResult";
import { Accordion } from "@navikt/ds-react";

const SearchForm = ({ fetchSearch, query, dispatchQuery, searchResult }) => {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */

    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    return (
        <form id="sok" className="Search__form" onSubmit={submitForm} role="search">
            <SkipToResult data={searchResult} />
            <h2 className="Search__h2">Søk</h2>
            <SearchBox query={query} dispatch={dispatchQuery} />
            <Accordion>
                <Counties query={query} dispatch={dispatchQuery} data={searchResult} />
                <Occupations query={query} dispatch={dispatchQuery} data={searchResult} />
                <Published query={query} dispatch={dispatchQuery} values={searchResult.aggregations.published} />
                <Extent query={query} dispatch={dispatchQuery} data={searchResult} />
                <EngagementType query={query} dispatch={dispatchQuery} data={searchResult} />
                <Sector query={query} dispatch={dispatchQuery} data={searchResult} />
            </Accordion>
            <div className="Search__reset-and-save-search">
                <SaveSearchButton query={query} />
                <ResetButton dispatch={dispatchQuery} />
            </div>
        </form>
    );
};

export default SearchForm;
