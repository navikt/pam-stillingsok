import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../../authentication/authenticationModalReducer';
import featureToggle from '../../featureToggle';
import { SHOW_TERMS_OF_USE_MODAL } from '../../termsOfUse/termsOfUseReducer';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';
import AuthorizationEnum from '../../authentication/AuthorizationEnum';

class ToggleFavouriteButton extends React.Component {
    onAddToFavouritesClick = () => {
        if (!this.props.isAuthenticated) {
            this.props.showError(AuthorizationEnum.ADD_FAVORITE_ERROR);
        } else if (!this.props.hasUser) {
            this.props.showTermsOfUse();
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
            favouriteAdUuidList, uuid, isFetchingFavourites
        } = this.props;
        const isFavourite = favouriteAdUuidList.includes(uuid);

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
    hasUser: PropTypes.bool.isRequired,
    isFetchingFavourites: PropTypes.bool.isRequired,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    favouriteAdUuidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
    showTermsOfUse: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    favouriteAdUuidList: state.favourites.favouriteAdUuidList,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    isAuthenticated: state.authentication.isAuthenticated,
    hasUser: state.user.hasUser
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text }),
    showTermsOfUse: () => dispatch({ type: SHOW_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
