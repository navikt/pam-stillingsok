import { Flatknapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../../authentication/authenticationModalReducer';
import AuthorizationEnum from '../../authentication/AuthorizationEnum';
import featureToggle from '../../featureToggle';
import { SHOW_TERMS_OF_USE_MODAL } from '../../termsOfUse/termsOfUseReducer';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteStar.less';

class ToggleFavouriteStar extends React.Component {
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
            favouriteAdUuidList, uuid, className, isFetchingFavourites
        } = this.props;
        const isFavourite = favouriteAdUuidList.includes(uuid);

        if (isFetchingFavourites) {
            return null;
        }

        if (isFavourite) {
            return (
                <Flatknapp
                    mini
                    aria-label="Favoritt"
                    aria-pressed="true"
                    onClick={this.onRemoveFromFavouritesClick}
                    className={className ? `ToggleFavouriteStar ${className}` : 'ToggleFavouriteStar'}
                >
                    <div className="ToggleFavouriteStar__flex">
                        <i className="ToggleFavouriteStar__star--active" />
                    </div>
                </Flatknapp>
            );
        }
        return (
            <Flatknapp
                mini
                onClick={this.onAddToFavouritesClick}
                aria-label="Favoritt"
                aria-pressed="false"
                className={className ? `ToggleFavouriteStar ${className}` : 'ToggleFavouriteStar'}
            >
                <div className="ToggleFavouriteStar__flex">
                    <i className="ToggleFavouriteStar__star"/>
                </div>
            </Flatknapp>
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
    favouriteAdUuidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showTermsOfUse: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    hasUser: PropTypes.bool.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteStar);
