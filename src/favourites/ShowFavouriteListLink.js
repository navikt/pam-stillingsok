import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function ShowFavouriteListLink({ isFetching, totalElements }) {
    return (
        <Link className="FavouritesLink" to="/favoritter">
            <span className="FavouritesLink__text lenke typo-element">
                Se favoritter {!isFetching ? ` (${totalElements})` : ''}
            </span>
        </Link>
    );
}

ShowFavouriteListLink.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    totalElements: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
    isFetching: state.favourites.isFetchingFavourites,
    totalElements: state.favourites.totalElements
});

export default connect(mapStateToProps)(ShowFavouriteListLink);
