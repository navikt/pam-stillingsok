import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteStar.less';

class ToggleFavouriteStar extends React.Component {
    onAddToFavouritesClick = () => {
        this.props.addToFavourites(this.props.uuid);
    };

    onRemoveFromFavouritesClick = () => {
        this.props.removeFromFavourites(this.props.uuid);
    };

    render() {
        const {
            adsMarkedAsFavorite, uuid, className, isFetchingFavourites, pendingFavouritesByAdUuid
        } = this.props;

        const isFavourite = adsMarkedAsFavorite.includes(uuid);
        const isPending = pendingFavouritesByAdUuid.includes(uuid);
        if (isFetchingFavourites) {
            return null;
        }

        if (isFavourite) {
            return (
                <button
                    disabled={isPending}
                    aria-label="Favoritt"
                    aria-pressed="true"
                    onClick={this.onRemoveFromFavouritesClick}
                    className={className ? `ToggleFavouriteStar ${className}` : 'ToggleFavouriteStar'}
                >
                    <div className="ToggleFavouriteStar__flex">
                        <span className="ToggleFavouriteStar__star--active" />
                    </div>
                </button>
            );
        }
        return (
            <button
                disabled={isPending}
                onClick={this.onAddToFavouritesClick}
                aria-label="Favoritt"
                aria-pressed="false"
                className={className ? `ToggleFavouriteStar ${className}` : 'ToggleFavouriteStar'}
            >
                <div className="ToggleFavouriteStar__flex">
                    <span className="ToggleFavouriteStar__star" />
                </div>
            </button>
        );
    }
}

ToggleFavouriteStar.defaultProps = {
    className: undefined
};

ToggleFavouriteStar.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    className: PropTypes.string,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    adsMarkedAsFavorite: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFavouritesByAdUuid: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    adsMarkedAsFavorite: state.favourites.adsMarkedAsFavorite,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    pendingFavouritesByAdUuid: state.favourites.pendingFavouritesByAdUuid
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteStar);
