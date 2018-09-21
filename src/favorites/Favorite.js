import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flatknapp } from 'nav-frontend-knapper';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { SHOW_MODAL_REMOVE_FROM_FAVORITES } from './favoritesReducer';
import SearchResultsItemDetails from '../search/searchResults/SearchResultsItemDetails';

class Favorite extends React.Component {
    onRemoveClick = () => {
        this.props.showModal(this.props.favorite.uuid);
    };

    toAd = (favorite) => ({
        uuid: favorite.uuid,
        title: favorite.title,
        updated: favorite.updated,
        properties: {
            employer: favorite.employer,
            jobtitle: favorite.jobTitle,
            location: favorite.location,
            applicationdue: favorite.applicationdue
        }
    });

    render() {
        const { favorite } = this.props;
        return (
            <div className="Favorite">
                <div className="Favorite__top">
                    {favorite.favouriteAd.status !== 'ACTIVE' && (
                        <EtikettFokus>Utløpt</EtikettFokus>
                    )}
                </div>
                <SearchResultsItemDetails stilling={this.toAd(favorite.favouriteAd)} />
                <div className="Favorite__buttons">
                    <Flatknapp mini onClick={this.onRemoveClick}>Slett</Flatknapp>
                </div>
            </div>
        );
    }
}

Favorite.propTypes = {
    showModal: PropTypes.func.isRequired,
    favorite: PropTypes.shape({
        uuid: PropTypes.string,
        favouriteAd: PropTypes.shape({
            status: PropTypes.string
        })
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showModal: (uuid) => dispatch({ type: SHOW_MODAL_REMOVE_FROM_FAVORITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);
