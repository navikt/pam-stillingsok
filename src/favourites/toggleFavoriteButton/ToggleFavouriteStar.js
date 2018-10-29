import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flatknapp } from 'nav-frontend-knapper';
import { CONTEXT_PATH } from '../../fasitProperties';
import featureToggle from '../../featureToggle';
import history from '../../history';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteStar.less';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../../authorization/authorizationReducer';
import AuthorizationEnum from '../../authorization/AuthorizationEnum';

class ToggleFavouriteStar extends React.Component {
    onAddToFavouritesClick = () => {
        if (!this.props.isLoggedIn) {
            this.props.showError(AuthorizationEnum.ADD_FAVORITE_ERROR);
        } else if (this.props.termsStatus !== 'accepted') {
            history.push(`${CONTEXT_PATH}/vilkaar`);
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
            adsMarkedAsFavorite, uuid, className, isFetchingFavourites
        } = this.props;
        const isFavourite = adsMarkedAsFavorite.includes(uuid);

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
                    <i className="ToggleFavouriteStar__star" />
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
    adsMarkedAsFavorite: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    adsMarkedAsFavorite: state.favourites.adsMarkedAsFavorite,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    isLoggedIn: state.authorization.isLoggedIn,
    termsStatus: state.authorization.termsStatus
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteStar);
