import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FlatButton } from '../../common/button';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteStar.less';

const ToggleFavouriteStar = withRouter(({
    addToFavourites,
    adsMarkedAsFavorite,
    className,
    history,
    isFetchingFavourites,
    removeFromFavourites,
    uuid
}) => {
    const isFavourite = adsMarkedAsFavorite.includes(uuid);

    const onClick = isFavourite
        ? () => removeFromFavourites(uuid)
        : () => addToFavourites(uuid, history);

    if (isFetchingFavourites) {
        return null;
    }

    return (
        <FlatButton
            mini
            aria-label="Favoritt"
            aria-pressed={isFavourite ? 'true' : 'false'}
            onClick={onClick}
            className={`ToggleFavouriteStar ${className || ''}`}
        >
            <div className="ToggleFavouriteStar__flex">
                <i className={isFavourite ? 'ToggleFavouriteStar__star--active' : 'ToggleFavouriteStar__star'} />
            </div>
        </FlatButton>
    );
});

ToggleFavouriteStar.defaultProps = {
    className: undefined
};

ToggleFavouriteStar.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    className: PropTypes.string,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    adsMarkedAsFavorite: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    adsMarkedAsFavorite: state.favourites.adsMarkedAsFavorite,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid, history) => dispatch({ type: ADD_TO_FAVOURITES, uuid, history }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteStar);
