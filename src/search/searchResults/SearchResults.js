import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchResultItem from './SearchResultsItem';

function SearchResults({ searchResult }) {
    const { stillinger } = searchResult;
    return (
        <div>
            {stillinger && stillinger.map((stilling) => (
                <SearchResultItem key={stilling.uuid} stilling={stilling} />
            ))}
        </div>
    );
}

SearchResults.propTypes = {
    searchResult: PropTypes.shape({
        stillinger: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};

const mapStateToProps = (state) => ({
    searchResult: state.search.searchResult
});

export default connect(mapStateToProps)(SearchResults);
