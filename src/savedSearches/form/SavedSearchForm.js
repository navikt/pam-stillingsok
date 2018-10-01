import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Checkbox, Fieldset, Input, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Lenkeknapp from '../../common/Lenkeknapp';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import { ADD_SAVED_SEARCH, UPDATE_SAVED_SEARCH } from '../savedSearchesReducer';
import './SavedSearchForm.less';
import {
    HIDE_SAVED_SEARCH_FORM,
    SavedSearchFormMode,
    SET_SAVED_SEARCH_DURATION,
    SET_SAVED_SEARCH_FORM_MODE,
    SET_SAVED_SEARCH_NOTIFY_TYPE,
    SET_SAVED_SEARCH_TITLE
} from './savedSearchFormReducer';

class SavedSearchForm extends React.Component {
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

    onFormModeChange = (e) => {
        this.props.setFormMode(e.target.value);
    };

    onSaveClick = () => {
        if (this.props.formMode === SavedSearchFormMode.ADD) {
            this.props.addSavedSearch();
        } else {
            this.props.updateSavedSearch();
        }
    };

    closeModal = () => {
        this.props.hideForm();
    };

    render() {
        const {
            showSavedSearchForm, formData, validation, isSaving, formMode, cancelButtonText, currentSavedSearch, showAddOrReplace
        } = this.props;

        if (showSavedSearchForm) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Lagre søk"
                    appElement={document.getElementById('app')}
                >
                    <div className="SavedSearchModal">
                        {showAddOrReplace ? (
                            <div>
                                <Undertittel className="SavedSearchModal__title">
                                    Du har endret et lagret søk
                                </Undertittel>
                                <SkjemaGruppe className="SavedSearchModal__form-mode">
                                    <Fieldset
                                        legend={`Ønsker du å lagre endringene for "${currentSavedSearch.title}" eller lagre et nytt søk?`}
                                    >
                                        <Radio
                                            label="Lagre endringene"
                                            name="update"
                                            key="update"
                                            value={SavedSearchFormMode.EDIT}
                                            onChange={this.onFormModeChange}
                                            checked={formMode === SavedSearchFormMode.EDIT}
                                        />
                                        <Radio
                                            label="Lagre nytt søk"
                                            name="add"
                                            key="add"
                                            value={SavedSearchFormMode.ADD}
                                            onChange={this.onFormModeChange}
                                            checked={formMode === SavedSearchFormMode.ADD}
                                        />
                                    </Fieldset>
                                </SkjemaGruppe>
                            </div>
                        ) : (
                            <div>
                                {formMode === SavedSearchFormMode.ADD && (
                                    <Undertittel className="SavedSearchModal__title">Lagre søk</Undertittel>
                                )}
                                {formMode === SavedSearchFormMode.EDIT && (
                                    <Undertittel className="SavedSearchModal__title">Endre søk</Undertittel>
                                )}
                            </div>
                        )}
                        {!(showAddOrReplace && formMode === SavedSearchFormMode.EDIT) && (
                            <div className="SavedSearchModal__body">
                                <Input
                                    className="SavedSearchModal__body__name"
                                    label="Navn*"
                                    onChange={this.onTitleChange}
                                    value={formData.title}
                                    feil={!validation.titleIsValid ?
                                        { feilmelding: 'Du må gi et navn på søket' } :
                                        undefined
                                    }
                                />
                                <Checkbox
                                    className="SavedSearchModal__body__notify"
                                    label="Ja, jeg ønsker å motta varsler om nye treff på e-post"
                                    onChange={this.onSubscribeChange}
                                    checked={formData.notifyType === NotifyTypeEnum.EMAIL}
                                />
                                {formData.notifyType === NotifyTypeEnum.EMAIL && (
                                    <SkjemaGruppe>
                                        <Fieldset legend="Jeg vil motta e-postvarsler i:">
                                            <Radio
                                                label="30 dager"
                                                name="duration"
                                                key="30dager"
                                                value="30"
                                                onChange={this.onDurationChange}
                                                checked={formData.duration === 30}
                                            />
                                            <Radio
                                                label="60 dager"
                                                name="duration"
                                                key="60dager"
                                                value="60"
                                                onChange={this.onDurationChange}
                                                checked={formData.duration === 60}
                                            />
                                            <Radio
                                                label="90 dager"
                                                name="duration"
                                                key="90dager"
                                                value="90"
                                                onChange={this.onDurationChange}
                                                checked={formData.duration === 90}
                                            />
                                        </Fieldset>
                                    </SkjemaGruppe>
                                )}
                            </div>
                        )}

                        <div className="SavedSearchModal__buttons">
                            <Hovedknapp
                                disabled={isSaving}
                                spinner={isSaving}
                                onClick={this.onSaveClick}
                            >
                                Lagre søk
                            </Hovedknapp>
                            <Lenkeknapp onClick={this.closeModal}>{cancelButtonText}</Lenkeknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

SavedSearchForm.defaultProps = {
    formData: undefined,
    currentSavedSearch: undefined
};

SavedSearchForm.propTypes = {
    showAddOrReplace: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    showSavedSearchForm: PropTypes.bool.isRequired,
    addSavedSearch: PropTypes.func.isRequired,
    updateSavedSearch: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setNotifyType: PropTypes.func.isRequired,
    setDuration: PropTypes.func.isRequired,
    setFormMode: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    formMode: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string.isRequired,
    currentSavedSearch: PropTypes.shape({
        title: PropTypes.string
    }),
    formData: PropTypes.shape({
        title: PropTypes.string
    }),
    validation: PropTypes.shape({
        titleIsValid: PropTypes.bool
    }).isRequired
};

const mapStateToProps = (state) => ({
    showSavedSearchForm: state.savedSearchForm.showSavedSearchForm,
    formMode: state.savedSearchForm.formMode,
    formData: state.savedSearchForm.formData,
    validation: state.savedSearchForm.validation,
    cancelButtonText: state.savedSearchForm.cancelButtonText,
    showAddOrReplace: state.savedSearchForm.showAddOrReplace,
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isSaving: state.savedSearches.isSaving
});

const mapDispatchToProps = (dispatch) => ({
    addSavedSearch: () => dispatch({ type: ADD_SAVED_SEARCH }),
    updateSavedSearch: () => dispatch({ type: UPDATE_SAVED_SEARCH }),
    setTitle: (title) => dispatch({ type: SET_SAVED_SEARCH_TITLE, title }),
    setNotifyType: (notifyType) => dispatch({ type: SET_SAVED_SEARCH_NOTIFY_TYPE, notifyType }),
    setDuration: (duration) => dispatch({ type: SET_SAVED_SEARCH_DURATION, duration }),
    setFormMode: (formMode) => dispatch({ type: SET_SAVED_SEARCH_FORM_MODE, formMode }),
    hideForm: () => dispatch({ type: HIDE_SAVED_SEARCH_FORM })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchForm);
