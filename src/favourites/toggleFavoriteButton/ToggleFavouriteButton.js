import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import featureToggle from '../../featureToggle';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../../authorization/authorizationReducer';
import AuthorizationEnum from '../../authorization/AuthorizationEnum';

class ToggleFavouriteButton extends React.Component {
    onAddToFavouritesClick = () => {
        if (!this.props.isLoggedIn) {
            this.props.showError(AuthorizationEnum.ADD_FAVORITE_ERROR);
        } else {
            this.props.addToFavourites(this.props.uuid);
        }
    };

    onRemoveFromFavouritesClick = () => {
        this.props.removeFromFavourites(this.props.uuid);
    };

    render() {
        if (!featureToggle()) {
            return null;
        }

        const {
            adsMarkedAsFavorite, uuid, isFetchingFavourites
        } = this.props;
        const isFavourite = adsMarkedAsFavorite.includes(uuid);

        if (isFetchingFavourites) {
            return null;
        }

        if (isFavourite) {
            return (
                <Flatknapp
                    mini
                    aria-label="Fjern favoritt"
                    onClick={this.onRemoveFromFavouritesClick}
                >
                    <div className="ToggleFavouriteButton__flex">
                        <i className="ToggleFavouriteButton__star ToggleFavouriteButton__star--active"/>
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
                aria-label="Lagre favoritt"
                onClick={this.onAddToFavouritesClick}
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
    uuid: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    adsMarkedAsFavorite: state.favourites.adsMarkedAsFavorite,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    isLoggedIn: state.authorization.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
