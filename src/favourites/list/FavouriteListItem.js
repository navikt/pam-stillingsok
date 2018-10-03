import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import Lenkeknapp from '../../common/Lenkeknapp';
import SearchResultsItemDetails from '../../search/searchResults/SearchResultsItemDetails';
import { SHOW_MODAL_REMOVE_FROM_FAVOURITES } from '../favouritesReducer';
import '../../common/Icons.less';

class FavouriteListItem extends React.Component {
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
            <div className="FavouriteListItem__wrapper">
                <div className="FavouriteListItem">
                    <div className="FavouriteListItem__top">
                        <SearchResultsItemDetails stilling={this.toAd(favourite.favouriteAd)} />
                    </div>
                    <div className="FavouriteListItem__bottom">
                        <Lenkeknapp onClick={this.onRemoveClick} className="Delete">
                            <i className="Delete__icon"/>
                            Slett
                        </Lenkeknapp>
                    </div>
                </div>
                {favourite.favouriteAd.status === 'INACTIVE' && (
                    <AlertStripe type="info" solid>
                        Stillingsannonsen er utløpt
                    </AlertStripe>
                )}
            </div>
        );
    }
}

FavouriteListItem.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteListItem);
