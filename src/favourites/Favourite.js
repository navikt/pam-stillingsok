import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flatknapp } from 'nav-frontend-knapper';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { SHOW_MODAL_REMOVE_FROM_FAVOURITES } from './favouritesReducer';
import SearchResultsItemDetails from '../search/searchResults/SearchResultsItemDetails';

class Favourite extends React.Component {
    onRemoveClick = () => {
        this.props.showModal(this.props.favourite.uuid);
    };

    toAd = (favourite) => ({
        uuid: favourite.uuid,
        title: favourite.title,
        updated: favourite.updated,
        properties: {
            employer: favourite.employer,
            jobtitle: favourite.jobTitle,
            location: favourite.location,
            applicationdue: favourite.applicationdue
        }
    });

    render() {
        const { favourite } = this.props;
        return (
            <div className="Favourite">
                <div className="Favourite__top">
                    {favourite.favouriteAd.status !== 'ACTIVE' && (
                        <EtikettFokus>Utløpt</EtikettFokus>
                    )}
                </div>
                <SearchResultsItemDetails stilling={this.toAd(favourite.favouriteAd)} />
                <div className="Favourite__buttons">
                    <Flatknapp mini onClick={this.onRemoveClick}>Slett</Flatknapp>
                </div>
            </div>
        );
    }
}

Favourite.propTypes = {
    showModal: PropTypes.func.isRequired,
    favourite: PropTypes.shape({
        uuid: PropTypes.string,
        favouriteAd: PropTypes.shape({
            status: PropTypes.string
        })
    }).isRequired
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
    showModal: (uuid) => dispatch({ type: SHOW_MODAL_REMOVE_FROM_FAVOURITES, uuid })
});

export default connect(mapStateToProps, mapDispatchToProps)(Favourite);
