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
        const {
            favoriteAdUuidList, uuid, className, showLabel, isFetchingFavorites
        } = this.props;
        const isFavorite = favoriteAdUuidList.includes(uuid);

        if (isFetchingFavorites) {
            return null;
        }

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
    isFetchingFavorites: PropTypes.bool.isRequired,
    className: PropTypes.string,
    addToFavorites: PropTypes.func.isRequired,
    removeFromFavorites: PropTypes.func.isRequired,
    favoriteAdUuidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showLabel: PropTypes.bool
};

const mapStateToProps = (state) => ({
    favoriteAdUuidList: state.favorites.favoriteAdUuidList,
    isFetchingFavorites: state.favorites.isFetchingFavorites
});

const mapDispatchToProps = (dispatch) => ({
    addToFavorites: (uuid) => dispatch({ type: ADD_TO_FAVORITES, uuid }),
    removeFromFavorites: (uuid) => dispatch({ type: REMOVE_FROM_FAVORITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteButton);
