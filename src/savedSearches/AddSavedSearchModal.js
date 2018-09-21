import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import NotifyTypeEnum from './enums/NotifyTypeEnum';
import {
    HIDE_ADD_SAVED_SEARCH_MODAL,
    ADD_SAVED_SEARCH_DURATION,
    ADD_SAVED_SEARCH_NOTIFY_TYPE,
    ADD_SAVED_SEARCH_TITLE,
    ADD_SAVED_SEARCH
} from './savedSearchesReducer';

class AddSavedSearchModal extends React.Component {
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
        this.props.addSavedSearch();
    };

    closeModal = () => {
        this.props.hideModal();
    };

    render() {
        const {
            savedSearchAboutToBeAdded, showAddSavedSearchModal, validation, isSaving
        } = this.props;
        if (showAddSavedSearchModal) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Lagre søk"
                    appElement={document.getElementById('app')}
                >
                    <div className="SavedSearches__modal">
                        <Undertittel className="SavedSearches__modal__title">Lagre søk</Undertittel>
                        <div className="SavedSearches__modal__body">
                            <Input
                                label="Navn*"
                                onChange={this.onTitleChange}
                                value={savedSearchAboutToBeAdded.title}
                                feil={!validation.titleIsValid ?
                                    { feilmelding: 'Du må gi et navn på søket' } :
                                    undefined
                                }
                            />
                            <Checkbox
                                label="Ja, jeg ønsker å motta varsler om nye treff på e-post"
                                onChange={this.onSubscribeChange}
                                checked={savedSearchAboutToBeAdded.notifyType === NotifyTypeEnum.EMAIL}
                            />
                            <SkjemaGruppe>
                                <Fieldset legend="Varighet på søket:">
                                    <Radio
                                        label="30 dager"
                                        name="duration"
                                        key="30dager"
                                        value="30"
                                        onChange={this.onDurationChange}
                                        checked={savedSearchAboutToBeAdded.duration === 30}
                                    />
                                    <Radio
                                        label="60 dager"
                                        name="duration"
                                        key="60dager"
                                        value="60"
                                        onChange={this.onDurationChange}
                                        checked={savedSearchAboutToBeAdded.duration === 60}
                                    />
                                    <Radio
                                        label="90 dager"
                                        name="duration"
                                        key="90dager"
                                        value="90"
                                        onChange={this.onDurationChange}
                                        checked={savedSearchAboutToBeAdded.duration === 90}
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
                            <Flatknapp onClick={this.closeModal}>Tilbake til stillingssøk</Flatknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

AddSavedSearchModal.defaultProps = {
    savedSearchAboutToBeAdded: undefined
};

AddSavedSearchModal.propTypes = {
    isSaving: PropTypes.bool.isRequired,
    showAddSavedSearchModal: PropTypes.bool.isRequired,
    addSavedSearch: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setNotifyType: PropTypes.func.isRequired,
    setDuration: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    savedSearchAboutToBeAdded: PropTypes.shape({
        title: PropTypes.string
    }),
    validation: PropTypes.shape({
        titleIsValid: PropTypes.bool
    }).isRequired
};

const mapStateToProps = (state) => ({
    showAddSavedSearchModal: state.savedSearches.showAddSavedSearchModal,
    savedSearchAboutToBeAdded: state.savedSearches.savedSearchAboutToBeAdded,
    validation: state.savedSearches.savedSearchAboutToBeAddedValidation,
    isSaving: state.savedSearches.isSaving
});

const mapDispatchToProps = (dispatch) => ({
    addSavedSearch: () => dispatch({ type: ADD_SAVED_SEARCH }),
    setTitle: (title) => dispatch({ type: ADD_SAVED_SEARCH_TITLE, title }),
    setNotifyType: (notifyType) => dispatch({ type: ADD_SAVED_SEARCH_NOTIFY_TYPE, notifyType }),
    setDuration: (duration) => dispatch({ type: ADD_SAVED_SEARCH_DURATION, duration }),
    hideModal: () => dispatch({ type: HIDE_ADD_SAVED_SEARCH_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSavedSearchModal);
