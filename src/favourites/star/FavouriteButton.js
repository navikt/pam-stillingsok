import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ADD_TO_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import './FavouriteButton.less';

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
                        <svg
                            width="24px"
                            height="23px"
                            viewBox="0 0 24 23"
                            version="1.1"
                        >
                            <title>star/uten fyll</title>
                            <desc>Created with Sketch.</desc>
                            <defs />
                            <g id="Symbols" stroke="none" strokeWidth="1" fill="#06893A" fillRule="evenodd">
                                <g id="Stillingssok/-liste" transform="translate(-773.000000, -21.000000)" stroke="#06893A">
                                    <g id="Group">
                                        <g id="star/uten-fyll-grå" transform="translate(773.000000, 21.000000)">
                                            <polygon
                                                id="Star"
                                                points="12 18 4.94657697 21.7082039 6.2936609 13.854102 0.587321804 8.29179607 8.47328849 7.14589803 12 0 15.5267115 7.14589803 23.4126782 8.29179607 17.7063391 13.854102 19.053423 21.7082039"
                                            />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
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
                    <svg
                        width="24px"
                        height="23px"
                        viewBox="0 0 24 23"
                        version="1.1"
                    >
                        <title>star/uten fyll</title>
                        <desc>Created with Sketch.</desc>
                        <defs />
                        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Stillingssok/-liste" transform="translate(-773.000000, -21.000000)" stroke="#3E3832">
                                <g id="Group">
                                    <g id="star/uten-fyll-grå" transform="translate(773.000000, 21.000000)">
                                        <polygon
                                            id="Star"
                                            points="12 18 4.94657697 21.7082039 6.2936609 13.854102 0.587321804 8.29179607 8.47328849 7.14589803 12 0 15.5267115 7.14589803 23.4126782 8.29179607 17.7063391 13.854102 19.053423 21.7082039"
                                        />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
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
