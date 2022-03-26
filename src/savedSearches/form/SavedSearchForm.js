import Modal from 'nav-frontend-modal';
import { Fieldset, Radio, SkjemaGruppe } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Flatknapp, Hovedknapp } from '@navikt/arbeidsplassen-knapper';
import { SET_EMAIL_FROM_SAVED_SEARCH } from '../../user/userReducer';
import { ADD_SAVED_SEARCH, UPDATE_SAVED_SEARCH } from '../savedSearchesReducer';
import AddOrReplaceForm from './AddOrReplaceForm';
import './SavedSearchForm.less';
import { HIDE_SAVED_SEARCH_FORM, SavedSearchFormMode, SET_SAVED_SEARCH_FORM_MODE } from './savedSearchFormReducer';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

class SavedSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.childForm = React.createRef();
    }

    onFormModeChange = (e) => {
        this.props.setFormMode(e.target.value);
    };

    onSaveClick = () => {
        if (!this.props.showRegisterEmail) {
            this.addOrUpdateSavedSearch();
            this.closeModal();
        } else {
            this.props.setEmailFromSavedSearch();
            this.addOrUpdateSavedSearch();
        }

        if (this.childForm && this.childForm.current) {
            this.childForm.current.getWrappedInstance().setFocusOnError();
        }
    };

    addOrUpdateSavedSearch() {
        if (this.props.formMode === SavedSearchFormMode.ADD) {
            this.props.addSavedSearch();
        } else {
            this.props.updateSavedSearch();
        }
    }

    emailSet = () => {
        return (this.props.user.email && this.props.user.email.trim().length !== 0);
    };

    closeModal = () => {
        this.props.hideForm();
    };

    harLagretNyEpost = () => {
        return this.props.showRegisterEmail && this.emailSet();
    };

    render() {
        const {
            showSavedSearchForm, isSaving, formMode, currentSavedSearch, showAddOrReplace
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

                        {this.harLagretNyEpost() ? (
                            <div>
                                <AlertStripeInfo className="alertstripe--solid infoboks">
                                    <div className="alertstripe__divider" />
                                    <Normaltekst>
                                        Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har
                                        mottatt.
                                    </Normaltekst>
                                </AlertStripeInfo>

                                <div className="SavedSearchModal__buttons">
                                    <Hovedknapp onClick={this.closeModal}>OK</Hovedknapp>
                                </div>
                            </div>
                        ) : (
                            <div>
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
                                                    onChange={this.onFormModeChange}
                                                    checked={formMode === SavedSearchFormMode.REPLACE}
                                                />
                                                <Radio
                                                    label="Lagre nytt søk"
                                                    name="add_or_replace"
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
                                            <Undertittel className="SavedSearchModal__title">Endre lagret
                                                søk</Undertittel>
                                        )}
                                    </div>
                                )}
                                <div className="SavedSearchModal__body">
                                    {formMode !== SavedSearchFormMode.REPLACE && !showAddOrReplace && (
                                        <AddOrReplaceForm ref={this.childForm} />
                                    )}
                                    {formMode !== SavedSearchFormMode.REPLACE && showAddOrReplace && (
                                        <SkjemaGruppe>
                                            <Fieldset legend="Lagre nytt søk">
                                                <AddOrReplaceForm ref={this.childForm} />
                                            </Fieldset>
                                        </SkjemaGruppe>
                                    )}
                                </div>

                                <div className="SavedSearchModal__buttons">
                                    <Hovedknapp
                                        id="SavedSearchModal__saveButton"
                                        disabled={isSaving}
                                        spinner={isSaving}
                                        onClick={this.onSaveClick}
                                    >
                                        Lagre
                                    </Hovedknapp>
                                    <Flatknapp onClick={this.closeModal}>Avbryt</Flatknapp>
                                </div>
                            </div>
                        )}


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
    user: PropTypes.shape({
        email: PropTypes.string
    }),
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
    user: state.user.user,
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
