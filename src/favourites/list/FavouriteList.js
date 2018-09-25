import { EtikettFokus } from 'nav-frontend-etiketter';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Lenkeknapp from '../../common/Lenkeknapp';
import SearchResultsItemDetails from '../../search/searchResults/SearchResultsItemDetails';
import { SHOW_MODAL_REMOVE_FROM_FAVOURITES } from '../favouritesReducer';

class Favourite extends React.Component {
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
                    <Lenkeknapp onClick={this.onRemoveClick}>Slett</Lenkeknapp>
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
