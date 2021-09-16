import PropTypes from 'prop-types';
import React from 'react';
import FavouriteListItem from './FavouriteListItem';
import './FavouriteList.less';

export default function FavouriteList({ favourites }) {
    return (
        <div>
            {favourites.map((favourite) => (
                <FavouriteListItem key={favourite.uuid} favourite={favourite} />
            ))}
        </div>
    );
}

FavouriteList.propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })).isRequired
};
