import React from "react";
import PropTypes from "prop-types";
import SearchBox from "./SearchBox";

function SearchBoxForm({ query, dispatchQuery }) {
    return <SearchBox query={query} dispatch={dispatchQuery} />;
}

SearchBoxForm.propTypes = {
    dispatchQuery: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
};

export default SearchBoxForm;
