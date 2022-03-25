import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Flatknapp } from '@navikt/arbeidsplassen-knapper';
import { ADD_STILLING_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
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
                    onClick={this.onRemoveFromFavouritesClick}
                    className="ToggleFavouriteButton"
                    aria-label="Slett favoritt"
                >
                    <div className="ToggleFavouriteButton__flex">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" role="img"><path fillRule="evenodd" clipRule="evenodd" d="M12 0l3.708 7.571L24 8.785l-6 5.893L19.416 23 12 19.071 4.584 23 6 14.678 0 8.785l8.292-1.214L12 0z" fill="currentColor"></path></svg>
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
                onClick={this.onAddToFavouritesClick}
                className="ToggleFavouriteButton"
                aria-label="Lagre favoritt"
            >
                <div className="ToggleFavouriteButton__flex">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" role="img"><path fillRule="evenodd" clipRule="evenodd" d="M12 0l3.708 7.571L24 8.785l-6 5.893L19.416 23 12 19.071 4.584 23 6 14.678 0 8.785l8.292-1.214L12 0zm2.312 9.508L12 4.788l-2.312 4.72-5.17.757 3.742 3.674-.884 5.186L12 16.677l4.623 2.448-.883-5.186 3.74-3.675-5.168-.756z" fill="currentColor"></path></svg>
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
    addToFavourites: (uuid) => dispatch({ type: ADD_STILLING_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
