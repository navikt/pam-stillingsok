import React from 'react';
import PropTypes from 'prop-types';
import ToggleFavouriteButton from '../../favourites/toggleFavoriteButton/ToggleFavouriteButton';
import SearchResultsItemDetails from './SearchResultsItemDetails';
import './SearchResultsItem.less';

export default function SearchResultItem({ stilling }) {
    return (
        <div className="SearchResultItem">
            <SearchResultsItemDetails stilling={stilling} />
            <ToggleFavouriteButton uuid={stilling.uuid} className="SearchResultItem__favourite" />
        </div>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
