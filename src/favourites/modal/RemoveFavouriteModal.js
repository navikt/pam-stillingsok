import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ConfirmationModal from '../../common/ConfirmationModal';
import { HIDE_MODAL_REMOVE_FROM_FAVOURITES, REMOVE_FROM_FAVOURITES } from '../favouritesReducer';

class RemoveFavouriteModal extends React.Component {
    onRemoveClick = () => {
        this.props.hideForm();
        this.props.removeFromFavourites(this.props.favouriteAboutToBeRemoved.favouriteAd.uuid);
    };

    closeModal = () => {
        this.props.hideForm();
    };

    render() {
        if (this.props.confirmationVisible) {
            return (
                <ConfirmationModal
                    title="Slett favoritt"
                    onConfirm={this.onRemoveClick}
                    onCancel={this.closeModal}
                    confirmLabel="Slett"
                >
                    Er du sikker på at du vil slette &#34;{this.props.favouriteAboutToBeRemoved.favouriteAd.title}&#34;?
                </ConfirmationModal>
            );
        }
        return null;
    }
}

RemoveFavouriteModal.defaultProps = {
    favouriteAboutToBeRemoved: undefined
};

RemoveFavouriteModal.propTypes = {
    removeFromFavourites: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    confirmationVisible: PropTypes.bool.isRequired,
    favouriteAboutToBeRemoved: PropTypes.shape({
        uuid: PropTypes.string,
        favouriteAd: PropTypes.shape({
            title: PropTypes.string
        })
    })
};

const mapStateToProps = (state) => ({
    confirmationVisible: state.favourites.confirmationVisible,
    favouriteAboutToBeRemoved: state.favourites.favouriteAboutToBeRemoved
});

const mapDispatchToProps = (dispatch) => ({
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    hideForm: () => dispatch({ type: HIDE_MODAL_REMOVE_FROM_FAVOURITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoveFavouriteModal);
