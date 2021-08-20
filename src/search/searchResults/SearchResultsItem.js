import PropTypes from 'prop-types';
import React from 'react';
import ToggleFavouriteStar from '../../favourites/toggleFavoriteButton/ToggleFavouriteStar';
import './SearchResultsItem.less';
import SearchResultsItemDetails from './SearchResultsItemDetails';

export default function SearchResultItem({ stilling }) {
    return (
        <div className="SearchResultItem">
            <SearchResultsItemDetails stilling={stilling} />
            <ToggleFavouriteStar uuid={stilling.uuid} className="SearchResultItem__favourite" />
        </div>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
