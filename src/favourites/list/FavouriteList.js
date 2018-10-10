import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import FavouriteListItem from './FavouriteListItem';
import './FavouriteList.less';

function FavouriteList({ favourites }) {
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

const mapStateToProps = (state) => ({
    favourites: state.favourites.favourites
});

export default connect(mapStateToProps)(FavouriteList);
