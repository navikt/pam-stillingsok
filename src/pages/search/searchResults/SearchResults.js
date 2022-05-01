import React from "react";
import PropTypes from "prop-types";
import SearchResultItem from "./SearchResultsItem";
import "./SearchResults.less";

const SearchResults = ({ searchResult }) => {
    return (
        <React.Fragment>
            {searchResult.stillinger &&
                searchResult.stillinger.map((stilling) => <SearchResultItem key={stilling.uuid} stilling={stilling} />)}
        </React.Fragment>
    );
};

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object).isRequired,
        total: PropTypes.shape({
            value: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    onLoadMoreClick: PropTypes.func.isRequired,
    query: PropTypes.shape({
        from: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired
    }).isRequired
};

export default SearchResults;
