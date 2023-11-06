import React from "react";
import PropTypes from "prop-types";
import SearchBox from "./SearchBox";

function SearchBoxForm({ query, dispatchQuery }) {
    function submitForm(e) {
        e.preventDefault();
    }

    return (
        <form className="mb-4" onSubmit={submitForm} role="search">
            <SearchBox query={query} dispatch={dispatchQuery} />
        </form>
    );
}

SearchBoxForm.propTypes = {
    dispatchQuery: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
};

export default SearchBoxForm;
