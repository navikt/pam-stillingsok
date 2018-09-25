import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './FavouriteButton.less';
import Star from './Star';

class FavouriteButton extends React.Component {
    onAddToFavouritesClick = () => {
        this.props.addToFavourites(this.props.uuid);
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
                    aria-label="Fjern favoritt"
                    className={className ? `FavouriteButton ${className}` : 'FavouriteButton'}
                >
                    <span className="FavouriteButton__star">
                        <Star fill="#06893A" stroke="#06893A" />
                    </span>
                    {showLabel && (
                        <span className="FavouriteButton__label typo-normal">Fjern favoritt</span>
                    )}
                </button>
            );
        }
        return (
            <button
                onClick={this.onAddToFavouritesClick}
                aria-label="Lagre favoritt"
                className={className ? `FavouriteButton ${className}` : 'FavouriteButton'}
            >
                <span className="FavouriteButton__star">
                    <Star fill="none" stroke="#3E3832" />
                </span>
                {showLabel && (
                    <span className="FavouriteButton__label typo-normal">Lagre favoritt</span>
                )}
            </button>
        );
    }
}

FavouriteButton.defaultProps = {
    className: undefined,
    showLabel: false
};

FavouriteButton.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    className: PropTypes.string,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    favouriteAdUuidList: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired,
    showLabel: PropTypes.bool
};

const mapStateToProps = (state) => ({
    favouriteAdUuidList: state.favourites.favouriteAdUuidList,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteButton);
