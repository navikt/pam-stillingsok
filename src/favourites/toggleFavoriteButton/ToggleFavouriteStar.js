import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import featureToggle from '../../featureToggle';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteStar.less';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../../authorization/authorizationReducer';
import AuthorizationEnum from '../../authorization/AuthorizationEnum';

class ToggleFavouriteStar extends React.Component {
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
            favouriteAdUuidList, uuid, className, isFetchingFavourites
        } = this.props;
        const isFavourite = favouriteAdUuidList.includes(uuid);

        if (isFetchingFavourites) {
            return null;
        }

        if (isFavourite) {
            return (
                <button
                    onClick={this.onRemoveFromFavouritesClick}
                    aria-label="Favoritt"
                    aria-pressed="true"
                    className={className ? `ToggleFavouriteStar ${className}` : 'ToggleFavouriteStar'}
                >
                    <span className="ToggleFavouriteStar__star">
                        &#9733;
                    </span>
                </button>
            );
        }
        return (
            <button
                onClick={this.onAddToFavouritesClick}
                aria-label="Favoritt"
                aria-pressed="false"
                className={className ? `ToggleFavouriteStar ${className}` : 'ToggleFavouriteStar'}
            >
                <span className="ToggleFavouriteStar__star">
                    &#9734;
                </span>
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
    favouriteAdUuidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showError: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    favouriteAdUuidList: state.favourites.favouriteAdUuidList,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    isLoggedIn: state.authorization.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteStar);
