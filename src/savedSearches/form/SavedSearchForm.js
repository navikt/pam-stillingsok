import Modal from 'nav-frontend-modal';
import { Fieldset, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { FlatButton, PrimaryButton } from '../../common/button';
import { SET_EMAIL_FROM_SAVED_SEARCH } from '../../user/userReducer';
import { ADD_SAVED_SEARCH, UPDATE_SAVED_SEARCH } from '../savedSearchesReducer';
import AddOrReplaceForm from './AddOrReplaceForm';
import './SavedSearchForm.less';
import { HIDE_SAVED_SEARCH_FORM, SavedSearchFormMode, SET_SAVED_SEARCH_FORM_MODE } from './savedSearchFormReducer';

const SavedSearchForm = ({
    addSavedSearch,
    currentSavedSearch,
    formMode,
    hideForm,
    isSaving,
    setEmailFromSavedSearch,
    setFormMode,
    showAddOrReplace,
    showRegisterEmail,
    showSavedSearchForm,
    updateSavedSearch
}) => {
    const childForm = useRef(null);

    const onFormModeChange = (e) => {
        setFormMode(e.target.value);
    };

    const onSaveClick = () => {
        if (showRegisterEmail) {
            setEmailFromSavedSearch();
        }
        if (formMode === SavedSearchFormMode.ADD) {
            addSavedSearch();
        } else {
            updateSavedSearch();
        }

        if (childForm && childForm.current) {
            childForm.current.getWrappedInstance().setFocusOnError();
        }
    };

    if (!showSavedSearchForm) {
        return null;
    }

    return (
        <Modal
            isOpen
            onRequestClose={hideForm}
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
                                    name="add_or_replace"
                                    key="replace"
                                    value={SavedSearchFormMode.REPLACE}
                                    onChange={onFormModeChange}
                                    checked={formMode === SavedSearchFormMode.REPLACE}
                                />
                                <Radio
                                    label="Lagre nytt søk"
                                    name="add_or_replace"
                                    key="add"
                                    value={SavedSearchFormMode.ADD}
                                    onChange={onFormModeChange}
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
                            <Undertittel className="SavedSearchModal__title">Endre lagret søk</Undertittel>
                        )}
                    </div>
                )}
                <div className="SavedSearchModal__body">
                    {formMode !== SavedSearchFormMode.REPLACE && !showAddOrReplace && (
                        <AddOrReplaceForm ref={childForm} />
                    )}
                    {formMode !== SavedSearchFormMode.REPLACE && showAddOrReplace && (
                        <SkjemaGruppe>
                            <Fieldset legend="Lagre nytt søk">
                                <AddOrReplaceForm ref={childForm} />
                            </Fieldset>
                        </SkjemaGruppe>
                    )}
                </div>

                <div className="SavedSearchModal__buttons">
                    <PrimaryButton
                        disabled={isSaving}
                        spinner={isSaving}
                        onClick={onSaveClick}
                    >
                        Lagre
                    </PrimaryButton>
                    <FlatButton onClick={hideForm}>Avbryt</FlatButton>
                </div>
            </div>
        </Modal>
    );
};

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
    currentSavedSearch: PropTypes.shape({
        title: PropTypes.string
    }),
    showRegisterEmail: PropTypes.bool.isRequired,
    setEmailFromSavedSearch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    showSavedSearchForm: state.savedSearchForm.showSavedSearchForm,
    formMode: state.savedSearchForm.formMode,
    showAddOrReplace: state.savedSearchForm.showAddOrReplace,
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isSaving: state.savedSearches.isSaving,
    showRegisterEmail: state.savedSearchForm.showRegisterEmail
});

const mapDispatchToProps = (dispatch) => ({
    addSavedSearch: () => dispatch({ type: ADD_SAVED_SEARCH }),
    updateSavedSearch: () => dispatch({ type: UPDATE_SAVED_SEARCH }),
    setFormMode: (formMode) => dispatch({ type: SET_SAVED_SEARCH_FORM_MODE, formMode }),
    hideForm: () => dispatch({ type: HIDE_SAVED_SEARCH_FORM }),
    setEmailFromSavedSearch: () => dispatch({ type: SET_EMAIL_FROM_SAVED_SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(SavedSearchForm);
