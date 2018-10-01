import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Fieldset, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Lenkeknapp from '../../common/Lenkeknapp';
import { ADD_SAVED_SEARCH, UPDATE_SAVED_SEARCH } from '../savedSearchesReducer';
import './SavedSearchForm.less';
import {
    HIDE_SAVED_SEARCH_FORM,
    SavedSearchFormMode,
    SET_SAVED_SEARCH_FORM_MODE
} from './savedSearchFormReducer';
import AddOrReplaceForm from './AddOrReplaceForm';

class SavedSearchForm extends React.Component {
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
            showSavedSearchForm, isSaving, formMode, cancelButtonText, currentSavedSearch, showAddOrReplace
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
                                {showAddOrReplace ? (
                                    <SkjemaGruppe>
                                        <Fieldset legend="Lagre nytt søk">
                                            <AddOrReplaceForm />
                                        </Fieldset>
                                    </SkjemaGruppe>
                                ) : (
                                    <AddOrReplaceForm />
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
    currentSavedSearch: undefined
};

SavedSearchForm.propTypes = {
    showAddOrReplace: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    showSavedSearchForm: PropTypes.bool.isRequired,
    addSavedSearch: PropTypes.func.isRequired,
    updateSavedSearch: PropTypes.func.isRequired,
    setFormMode: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    formMode: PropTypes.string.isRequired,
    cancelButtonText: PropTypes.string.isRequired,
    currentSavedSearch: PropTypes.shape({
        title: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    showSavedSearchForm: state.savedSearchForm.showSavedSearchForm,
    formMode: state.savedSearchForm.formMode,
    cancelButtonText: state.savedSearchForm.cancelButtonText,
    showAddOrReplace: state.savedSearchForm.showAddOrReplace,
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isSaving: state.savedSearches.isSaving
});

const mapDispatchToProps = (dispatch) => ({
    addSavedSearch: () => dispatch({ type: ADD_SAVED_SEARCH }),
    updateSavedSearch: () => dispatch({ type: UPDATE_SAVED_SEARCH }),
    setFormMode: (formMode) => dispatch({ type: SET_SAVED_SEARCH_FORM_MODE, formMode }),
    hideForm: () => dispatch({ type: HIDE_SAVED_SEARCH_FORM })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchForm);
