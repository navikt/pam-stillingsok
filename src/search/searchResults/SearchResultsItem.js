import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../../fasitProperties';
import ToggleFavouriteStar from '../../favourites/toggleFavoriteButton/ToggleFavouriteStar';
import SearchResultsItemDetails from './SearchResultsItemDetails';
import './SearchResultsItem.less';

export default function SearchResultItem({ stilling }) {
    return (
        <div className="SearchResultItem">
            <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`} className="SearchResultItem__link">
                <SearchResultsItemDetails stilling={stilling} inlineLink={false} />
            </Link>
            <ToggleFavouriteStar uuid={stilling.uuid} className="SearchResultItem__favourite" />
        </div>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({}).isRequired
};
