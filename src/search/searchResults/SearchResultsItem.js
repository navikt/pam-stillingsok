import PropTypes from 'prop-types';
import React from 'react';
import './SearchResultsItem.less';
import SearchResultsItemDetails from './SearchResultsItemDetails';

export default function SearchResultItem({ stilling }) {
    return (
        <div className="SearchResultItem">
            <SearchResultsItemDetails stilling={stilling} />
        </div>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
