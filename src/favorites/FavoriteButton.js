import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from './favoritesReducer';
import './FavoriteButton.less';

class FavoriteButton extends React.Component {
    onAddToFavoritesClick = () => {
        this.props.addToFavorites(this.props.uuid);
    };

    onRemoveFromFavoritesClick = () => {
        this.props.removeFromFavorites(this.props.uuid);
    };

    render() {
        const { favorites, uuid, className, showLabel } = this.props;
        const isFavorite = favorites && favorites.includes(uuid);
        if (isFavorite) {
            return (
                <button
                    onClick={this.onRemoveFromFavoritesClick}
                    aria-label="Fjern favoritt"
                    className={className ? `FavoriteButton ${className}` : 'FavoriteButton'}
                >
                    <span className="FavoriteButton__star">&#9733;</span>
                    {showLabel && (
                        <span className="FavoriteButton__label typo-normal">Fjern favoritt</span>
                    )}
                </button>
            );
        }
        return (
            <button
                onClick={this.onAddToFavoritesClick}
                aria-label="Lagre favoritt"
                className={className ? `FavoriteButton ${className}` : 'FavoriteButton'}
            >
                <span className="FavoriteButton__star">&#9734;</span>
                {showLabel && (
                    <span className="FavoriteButton__label typo-normal">Lagre favoritt</span>
                )}
            </button>
        );
    }
}

FavoriteButton.defaultProps = {
    className: undefined,
    showLabel: false
};

FavoriteButton.propTypes = {
    className: PropTypes.string,
    addToFavorites: PropTypes.func.isRequired,
    removeFromFavorites: PropTypes.func.isRequired,
    favorites: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showLabel: PropTypes.bool
};

const mapStateToProps = (state) => ({
    favorites: state.favorites.favorites
});

const mapDispatchToProps = (dispatch) => ({
    addToFavorites: (uuid) => dispatch({ type: ADD_TO_FAVORITES, uuid }),
    removeFromFavorites: (uuid) => dispatch({ type: REMOVE_FROM_FAVORITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteButton);
