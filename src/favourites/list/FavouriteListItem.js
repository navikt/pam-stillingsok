import classNames from 'classnames';
import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { LinkButton } from '../../common/button/';
import '../../common/Icons.less';
import SearchResultsItemDetails from '../../search/searchResults/SearchResultsItemDetails';
import { SHOW_MODAL_REMOVE_FROM_FAVOURITES } from '../favouritesReducer';

class FavouriteListItem extends React.Component {
    onRemoveClick = () => {
        this.props.showModal(this.props.favourite.uuid);
    };

    toAd = (favourite) => ({
        uuid: favourite.uuid,
        title: favourite.title,
        published: favourite.published,
        properties: {
            employer: favourite.employer,
            jobtitle: favourite.jobTitle,
            location: favourite.location,
            applicationdue: favourite.applicationdue
        }
    });

    render() {
        const { favourite } = this.props;
        const expired = favourite.favouriteAd.status !== 'ACTIVE';
        return (
            <div className="FavouriteListItem__wrapper">
                <div className={classNames('FavouriteListItem', { 'FavouriteListItem--expired': expired })}>
                    <SearchResultsItemDetails stilling={this.toAd(favourite.favouriteAd)} />
                    <LinkButton onClick={this.onRemoveClick} className="FavouriteListItem__delete Delete" aria-label="Slett">
                        <i className="Delete__icon" />
                    </LinkButton>
                </div>
                {expired && (
                    <AlertStripe type="info" solid className="FavouriteListItem__alertstripe">
                        Denne annonsen er utløpt
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
