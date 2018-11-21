import { Knapp } from 'nav-frontend-knapper';
import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AuthorizationEnum from '../user/AuthorizationEnum';
import { SHOW_AUTHORIZATION_ERROR_MODAL, SHOW_TERMS_OF_USE_MODAL } from '../user/userReducer';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';

class SaveSearchButton extends React.Component {
    onClick = () => {
        const {
            isAuthenticated, showError, user, showTermsOfUseModal, showSavedSearchForm, currentSavedSearch
        } = this.props;
        if (isAuthenticated !== true) {
            showError(AuthorizationEnum.SAVE_SEARCH_ERROR);
        } else if (!user) {
            showTermsOfUseModal();
        } else {
            showSavedSearchForm(
                currentSavedSearch ? SavedSearchFormMode.REPLACE : SavedSearchFormMode.ADD,
                currentSavedSearch !== undefined

            );
        }
    };

    render() {
        return this.props.canSaveSearch ? (
            <Knapp mini className="SaveSearchButton" onClick={this.onClick}>Lagre søk</Knapp>
        ) : (
            <HjelpetekstBase
                id="hjelpetekstLagreknapp"
                anchor={() => (
                    <div role="button" className="knapp knapp--mini knapp--disabled SaveSearchButton">
                        Lagre søk
                    </div>
                )}
                tittel="Du må fylle inn søkeord eller kriterier for å kunne lagre."
            >
                Du må fylle inn søkeord eller kriterier for å kunne lagre.
            </HjelpetekstBase>
        );
    }
}

SaveSearchButton.defaultProps = {
    currentSavedSearch: undefined,
    user: undefined,
    isAuthenticated: undefined
};

SaveSearchButton.propTypes = {
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({}),
    showError: PropTypes.func.isRequired,
    showTermsOfUseModal: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    canSaveSearch: PropTypes.bool.isRequired,
    user: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user,
    canSaveSearch: state.savedSearches.canSaveSearch
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace
    }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text }),
    showTermsOfUseModal: () => dispatch({ type: SHOW_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
