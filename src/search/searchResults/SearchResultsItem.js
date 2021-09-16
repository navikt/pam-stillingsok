import PropTypes from 'prop-types';
import React from 'react';
import './SearchResultsItem.less';
import SearchResultsItemDetails from './SearchResultsItemDetails';
import FavouriteButton from '../../favourites/favouritebutton/FavouriteButton';

export default function SearchResultItem({ stilling }) {
    return (
        <div className="SearchResultItem">
            <SearchResultsItemDetails stilling={stilling} />
            <div className="SearchResultItem__favourite">
                <FavouriteButton ad={stilling} showButtonText={false} />
            </div>
        </div>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
