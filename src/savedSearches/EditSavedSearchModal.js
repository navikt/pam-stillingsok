import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Lenkeknapp from '../common/Lenkeknapp';
import NotifyTypeEnum from './enums/NotifyTypeEnum';
import {
    HIDE_EDIT_SAVED_SEARCH_MODAL,
    SET_SAVED_SEARCH_DURATION,
    SET_SAVED_SEARCH_NOTIFY_TYPE,
    SET_SAVED_SEARCH_TITLE,
    UPDATE_SAVED_SEARCH
} from './savedSearchesReducer';

class EditSavedSearchModal extends React.Component {
    onTitleChange = (e) => {
        this.props.setTitle(e.target.value);
    };

    onSubscribeChange = (e) => {
        if (e.target.checked) {
            this.props.setNotifyType(NotifyTypeEnum.EMAIL);
        } else {
            this.props.setNotifyType(NotifyTypeEnum.NONE);
        }
    };

    onDurationChange = (e) => {
        this.props.setDuration(e.target.value);
    };

    onSaveClick = () => {
        this.props.updateSavedSearch();
    };

    closeModal = () => {
        this.props.hideModal();
    };

    render() {
        const { savedSearchAboutToBeEdited, showEditSavedSearchModal, validation, isSaving } = this.props;
        if (showEditSavedSearchModal) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Endre lagret søk"
                    appElement={document.getElementById('app')}
                >
                    <div className="SavedSearches__modal">
                        <Undertittel className="SavedSearches__modal__title">Endre lagret søk</Undertittel>
                        <div className="SavedSearches__modal__body">
                            <Input
                                className="blokk"
                                label="Navn*"
                                onChange={this.onTitleChange}
                                value={savedSearchAboutToBeEdited.title}
                                feil={!validation.titleIsValid ?
                                    { feilmelding: 'Du må gi et navn på søket' } :
                                    undefined
                                }
                            />
                            <Checkbox
                                className="blokk"
                                label="Ja, jeg ønsker å motta varsler om nye treff på e-post"
                                onChange={this.onSubscribeChange}
                                checked={savedSearchAboutToBeEdited.notifyType === NotifyTypeEnum.EMAIL}
                            />
                            <SkjemaGruppe>
                                <Fieldset legend="Varighet på søket:">
                                    <Radio
                                        label="30 dager"
                                        name="duration"
                                        key="30dager"
                                        value="30"
                                        onChange={this.onDurationChange}
                                        checked={savedSearchAboutToBeEdited.duration === 30}
                                    />
                                    <Radio
                                        label="60 dager"
                                        name="duration"
                                        key="60dager"
                                        value="60"
                                        onChange={this.onDurationChange}
                                        checked={savedSearchAboutToBeEdited.duration === 60}
                                    />
                                    <Radio
                                        label="90 dager"
                                        name="duration"
                                        key="90dager"
                                        value="90"
                                        onChange={this.onDurationChange}
                                        checked={savedSearchAboutToBeEdited.duration === 90}
                                    />
                                </Fieldset>
                            </SkjemaGruppe>
                        </div>
                        <div className="SavedSearches__modal__buttons">
                            <Hovedknapp
                                disabled={isSaving}
                                spinner={isSaving}
                                onClick={this.onSaveClick}
                            >
                                Lagre søk
                            </Hovedknapp>
                            <Lenkeknapp onClick={this.closeModal}>Tilbake til lagrede søk</Lenkeknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

EditSavedSearchModal.defaultProps = {
    savedSearchAboutToBeEdited: undefined
};

EditSavedSearchModal.propTypes = {
    isSaving: PropTypes.bool.isRequired,
    showEditSavedSearchModal: PropTypes.bool.isRequired,
    updateSavedSearch: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setNotifyType: PropTypes.func.isRequired,
    setDuration: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    savedSearchAboutToBeEdited: PropTypes.shape({
        title: PropTypes.string
    }),
    validation: PropTypes.shape({
        titleIsValid: PropTypes.bool
    }).isRequired
};

const mapStateToProps = (state) => ({
    showEditSavedSearchModal: state.savedSearches.showEditSavedSearchModal,
    savedSearchAboutToBeEdited: state.savedSearches.savedSearchAboutToBeEdited,
    validation: state.savedSearches.savedSearchAboutToBeEditedValidation,
    isSaving: state.savedSearches.isSaving
});

const mapDispatchToProps = (dispatch) => ({
    updateSavedSearch: () => dispatch({ type: UPDATE_SAVED_SEARCH }),
    setTitle: (title) => dispatch({ type: SET_SAVED_SEARCH_TITLE, title }),
    setNotifyType: (notifyType) => dispatch({ type: SET_SAVED_SEARCH_NOTIFY_TYPE, notifyType }),
    setDuration: (duration) => dispatch({ type: SET_SAVED_SEARCH_DURATION, duration }),
    hideModal: () => dispatch({ type: HIDE_EDIT_SAVED_SEARCH_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSavedSearchModal);
