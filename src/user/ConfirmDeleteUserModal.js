import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { HIDE_MODAL_REMOVE_SAVED_SEARCH, REMOVE_SAVED_SEARCH } from './savedSearchesReducer';

class ConfirmDeleteUserModal extends React.Component {
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
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Slett konto"
                    appElement={document.getElementById('app')}
                >
                    <div className="SavedSearchModal">
                        <Undertittel className="SavedSearchModal__title">Slett konto</Undertittel>
                        <div className="SavedSearchModal__body">
                            <Normaltekst>
                                Er du sikker på at du vil slette konto?
                            </Normaltekst>
                        </div>
                        <div className="SavedSearchModal__buttons">
                            <Hovedknapp onClick={this.onRemoveClick}>Slett konto</Hovedknapp>
                            <Flatknapp onClick={this.closeModal}>Avbryt</Flatknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

ConfirmDeleteUserModal.defaultProps = {
    savedSearchAboutToBeRemoved: undefined
};

ConfirmDeleteUserModal.propTypes = {
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
