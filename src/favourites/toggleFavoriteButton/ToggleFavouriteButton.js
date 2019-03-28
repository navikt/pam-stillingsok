import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Flatknapp } from 'pam-frontend-knapper';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';

class ToggleFavouriteButton extends React.Component {
    onAddToFavouritesClick = () => {
        this.props.addToFavourites(this.props.uuid);
    };

    onRemoveFromFavouritesClick = () => {
        this.props.removeFromFavourites(this.props.uuid);
    };

    render() {
        const {
            adsMarkedAsFavorite, uuid, isFetchingFavourites, pendingFavouritesByAdUuid
        } = this.props;

        const isFavourite = adsMarkedAsFavorite.includes(uuid);
        const isPending = pendingFavouritesByAdUuid.includes(uuid);

        if (isFetchingFavourites) {
            return null;
        }

        if (isFavourite) {
            return (
                <Flatknapp
                    mini
                    disabled={isPending}
                    aria-label="Fjern favoritt"
                    onClick={this.onRemoveFromFavouritesClick}
                    className="ToggleFavouriteButton"
                >
                    <div className="ToggleFavouriteButton__flex">
                        <i className="ToggleFavouriteButton__star ToggleFavouriteButton__star--active" />
                        <span className="ToggleFavouriteButton__label">
                            Slett favoritt
                        </span>
                    </div>
                </Flatknapp>
            );
        }
        return (
            <Flatknapp
                mini
                disabled={isPending}
                aria-label="Lagre favoritt"
                onClick={this.onAddToFavouritesClick}
                className="ToggleFavouriteButton"
            >
                <div className="ToggleFavouriteButton__flex">
                    <i className="ToggleFavouriteButton__star" />
                    <span className="ToggleFavouriteButton__label">
                    Lagre favoritt
                    </span>
                </div>
            </Flatknapp>
        );
    }
}


ToggleFavouriteButton.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
