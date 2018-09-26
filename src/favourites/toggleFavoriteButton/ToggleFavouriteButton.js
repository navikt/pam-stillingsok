import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';
import Star from './Star';

class ToggleFavouriteButton extends React.Component {
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
                aria-label="Lagre favoritt"
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
    showLabel: false
};

ToggleFavouriteButton.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
