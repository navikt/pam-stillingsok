import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FlatButton } from '../../common/button';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';

const ToggleFavouriteButton = withRouter(({
    addToFavourites,
    adsMarkedAsFavorite,
    history,
    isFetchingFavourites,
    removeFromFavourites,
    uuid
}) => {
    const isFavourite = adsMarkedAsFavorite.includes(uuid);

    const onClick = isFavourite
        ? () => removeFromFavourites(uuid)
        : () => addToFavourites(uuid, history);

    const labelValue = isFavourite
        ? 'Slett favoritt'
        : 'Lagre favoritt';

    const starClassName = isFavourite
        ? 'ToggleFavouriteButton__star ToggleFavouriteButton__star--active'
        : 'ToggleFavouriteButton__star';

    if (isFetchingFavourites) {
        return null;
    }

    return (
        <FlatButton
            mini
            aria-label={labelValue}
            onClick={onClick}
            className="ToggleFavouriteButton"
        >
            <div className="ToggleFavouriteButton__flex">
                <i className={starClassName} />
                <span className="ToggleFavouriteButton__label">
                    {labelValue}
                </span>
            </div>
        </FlatButton>
    );
});

ToggleFavouriteButton.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
