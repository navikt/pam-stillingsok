import React from "react";
import PropTypes from "prop-types";
import SearchBox from "./SearchBox";

function SearchBoxForm({ fetchSearch, query, dispatchQuery }) {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    return (
        <form className="mb-4" onSubmit={submitForm} role="search">
            <SearchBox query={query} dispatch={dispatchQuery} />
        </form>
    );
}

SearchBoxForm.propTypes = {
    fetchSearch: PropTypes.func.isRequired,
    dispatchQuery: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
};

export default SearchBoxForm;
