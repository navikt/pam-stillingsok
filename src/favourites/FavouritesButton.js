import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function FavouritesButton({ isFetching, totalElements }) {
    return (
        <Link className="knapp knapp--mini" to="/favoritter">
            Favoritter {!isFetching ? ` (${totalElements})` : ''}
        </Link>
    );
}

FavouritesButton.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    totalElements: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    isFetching: state.favourites.isFetchingFavourites,
    totalElements: state.favourites.totalElements
});

export default connect(mapStateToProps)(FavouritesButton);
