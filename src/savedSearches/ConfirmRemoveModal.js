import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { HIDE_MODAL_REMOVE_SAVED_SEARCH, REMOVE_SAVED_SEARCH } from './savedSearchesReducer';

class ConfirmRemoveModal extends React.Component {
    onRemoveClick = () => {
        this.props.hideModal();
        this.props.removeSavedSearch(this.props.savedSearchAboutToBeRemoved.uuid);
    };

    closeModal = () => {
        this.props.hideModal();
    };

    render() {
        if (this.props.confirmationVisible) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Slett lagret søk"
                    appElement={document.getElementById('app')}
                >
                    <div className="Favourites__modal">
                        <Undertittel className="Favourites__modal__title">Slett lagret søk</Undertittel>
                        <div className="SavedSearches__modal__body">
                            <Normaltekst>
                                Er du sikker på at du vil slette {this.props.savedSearchAboutToBeRemoved.title}?
                            </Normaltekst>
                        </div>
                        <div className="Favourites__modal__buttons">
                            <Hovedknapp onClick={this.onRemoveClick}>Slett</Hovedknapp>
                            <Flatknapp onClick={this.closeModal}>Tilbake til lagrede søk</Flatknapp>
                        </div>
                    </div>
                </Modal>
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
    hideModal: PropTypes.func.isRequired,
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
    hideModal: () => dispatch({ type: HIDE_MODAL_REMOVE_SAVED_SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveModal);
