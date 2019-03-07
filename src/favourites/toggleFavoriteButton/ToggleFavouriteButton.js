import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FlatButton } from '../../common/button';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './ToggleFavouriteButton.less';

class ToggleFavouriteButton extends React.Component {
    onAddToFavouritesClick = () => {
        this.props.addToFavourites(this.props.uuid);
    };

    onRemoveFromFavouritesClick = () => {
        this.props.removeFromFavourites(this.props.uuid);
    };

    render() {
        const {
            adsMarkedAsFavorite, uuid, isFetchingFavourites
        } = this.props;
        const isFavourite = adsMarkedAsFavorite.includes(uuid);

        if (isFetchingFavourites) {
            return null;
        }

        if (isFavourite) {
            return (
                <FlatButton
                    mini
                    aria-label="Fjern favoritt"
                    onClick={this.onRemoveFromFavouritesClick}
                    className="ToggleFavouriteButton"
                >
                    <div className="ToggleFavouriteButton__flex">
                        <i className="ToggleFavouriteButton__star ToggleFavouriteButton__star--active" />
                        <span className="ToggleFavouriteButton__label">
                            Slett favoritt
                        </span>
                    </div>
                </FlatButton>
            );
        }
        return (
            <FlatButton
                mini
                aria-label="Lagre favoritt"
                onClick={this.onAddToFavouritesClick}
                className="ToggleFavouriteButton"
            >
                <div className="ToggleFavouriteButton__flex">
                    <i className="ToggleFavouriteButton__star" />
                    <span className="ToggleFavouriteButton__label">
                    Lagre favoritt
                    </span>
                </div>
            </FlatButton>
        );
    }
}


ToggleFavouriteButton.propTypes = {
    isFetchingFavourites: PropTypes.bool.isRequired,
    addToFavourites: PropTypes.func.isRequired,
    removeFromFavourites: PropTypes.func.isRequired,
    adsMarkedAsFavorite: PropTypes.arrayOf(PropTypes.string).isRequired,
    uuid: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    adsMarkedAsFavorite: state.favourites.adsMarkedAsFavorite,
    isFetchingFavourites: state.favourites.isFetchingFavourites
});

const mapDispatchToProps = (dispatch) => ({
    addToFavourites: (uuid) => dispatch({ type: ADD_TO_FAVOURITES, uuid }),
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleFavouriteButton);
