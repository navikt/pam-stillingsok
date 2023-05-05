import React from "react";
import SearchBox from "./SearchBox";

const SearchForm = ({ fetchSearch, query, dispatchQuery }) => {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    return (
        <form id="sok" className="mb-1" onSubmit={submitForm} role="search">
            <SearchBox query={query} dispatch={dispatchQuery} />
        </form>
    );
};

export default SearchForm;
