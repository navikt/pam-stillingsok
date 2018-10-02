import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';
import Star from './Star';
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
        const {
            favouriteAdUuidList, uuid, className, showLabel, isFetchingFavourites
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
                    className={className ? `ToggleFavouriteButton ${className}` : 'ToggleFavouriteButton'}
                >
                    <span className="ToggleFavouriteButton__star">
                        <Star fill="#06893A" stroke="#06893A" />
                    </span>
                    {showLabel && (
                        <span className="ToggleFavouriteButton__label typo-normal">Fjern favoritt</span>
                    )}
                </button>
            );
        }
        return (
            <button
                onClick={this.onAddToFavouritesClick}
                aria-label="Favoritt"
                aria-pressed="false"
                className={className ? `ToggleFavouriteButton ${className}` : 'ToggleFavouriteButton'}
            >
                <span className="ToggleFavouriteButton__star">
                    <Star fill="none" stroke="#3E3832" />
                </span>
                {showLabel && (
                    <span className="ToggleFavouriteButton__label typo-normal">Lagre favoritt</span>
                )}
            </button>
        );
    }
}

ToggleFavouriteButton.defaultProps = {
    className: undefined,
    showLabel: false,
    httpStatus: undefined
};

ToggleFavouriteButton.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    className: PropTypes.string,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    favouriteAdUuidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showLabel: PropTypes.bool,
    httpStatus: PropTypes.number,
    showError: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    favouriteAdUuidList: state.favourites.favouriteAdUuidList,
    isFetchingFavourites: state.favourites.isFetchingFavourites,
    httpStatus: state.favourites.httpErrorStatus,
    isLoggedIn: state.authorization.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
