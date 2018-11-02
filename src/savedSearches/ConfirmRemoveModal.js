import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ConfirmationModal from '../common/ConfirmationModal';
import { HIDE_MODAL_REMOVE_SAVED_SEARCH, REMOVE_SAVED_SEARCH } from './savedSearchesReducer';

class ConfirmRemoveModal extends React.Component {
    onRemoveClick = () => {
        this.props.hideForm();
        this.props.removeSavedSearch(this.props.savedSearchAboutToBeRemoved.uuid);
    };

    closeModal = () => {
        this.props.hideForm();
    };

    render() {
        if (this.props.confirmationVisible) {
            return (
                <ConfirmationModal
                    title="Slett lagret søk"
                    onConfirm={this.onRemoveClick}
                    onCancel={this.closeModal}
                    confirmLabel="Slett"
                >
                    Er du sikker på at du vil slette &#34;{this.props.savedSearchAboutToBeRemoved.title}&#34;?
                </ConfirmationModal>
            );
        }
        return null;
    }
}

ConfirmRemoveModal.defaultProps = {
    savedSearchAboutToBeRemoved: undefined
};

ConfirmRemoveModal.propTypes = {
    removeSavedSearch: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    confirmationVisible: PropTypes.bool.isRequired,
    savedSearchAboutToBeRemoved: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    confirmationVisible: state.savedSearches.confirmationVisible,
    savedSearchAboutToBeRemoved: state.savedSearches.savedSearchAboutToBeRemoved
});

const mapDispatchToProps = (dispatch) => ({
    removeSavedSearch: (uuid) => dispatch({ type: REMOVE_SAVED_SEARCH, uuid }),
    hideForm: () => dispatch({ type: HIDE_MODAL_REMOVE_SAVED_SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveModal);
