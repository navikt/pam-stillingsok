import { Flatknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AuthorizationEnum from '../../user/AuthorizationEnum';
import { SHOW_AUTHORIZATION_ERROR_MODAL, SHOW_TERMS_OF_USE_MODAL } from '../../user/userReducer';
import featureToggle from '../../featureToggle';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';

class ToggleFavouriteButton extends React.Component {
    onAddToFavouritesClick = () => {
        if (this.props.isAuthenticated !== true) {
            this.props.showError(AuthorizationEnum.ADD_FAVORITE_ERROR);
        } else if (!this.props.user) {
            this.props.showTermsOfUseModal();
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

ToggleFavouriteButton.defaultProps = {
    user: undefined,
    isAuthenticated: undefined
};

ToggleFavouriteButton.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    adsMarkedAsFavorite: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
    showTermsOfUseModal: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    adsMarkedAsFavorite: state.favourites.adsMarkedAsFavorite,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text }),
    showTermsOfUseModal: () => dispatch({ type: SHOW_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
