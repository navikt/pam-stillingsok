import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../fasitProperties';

function ShowFavouriteListLink({ isFetching, totalElements }) {
    return (
        <Link className="FavouritesLink" to={`${CONTEXT_PATH}/favoritter`}>
            <span className="FavouritesLink__text lenke typo-element">
                Favoritter {!isFetching ? ` (${totalElements})` : ''}
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
