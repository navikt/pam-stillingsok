import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../authentication/authenticationModalReducer';
import AuthorizationEnum from '../authentication/AuthorizationEnum';
import { SHOW_TERMS_OF_USE_MODAL } from '../termsOfUse/termsOfUseReducer';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';

class SaveSearchButton extends React.Component {
    onClick = () => {
        if (!this.props.isAuthenticated) {
            this.props.showError(AuthorizationEnum.SAVE_SEARCH_ERROR);
        } else if (!this.props.hasUser) {
            this.props.showTermsOfUse();
        } else {
            this.props.showSavedSearchForm(
                this.props.currentSavedSearch ? SavedSearchFormMode.REPLACE : SavedSearchFormMode.ADD,
                this.props.currentSavedSearch !== undefined

            );
        }
    };

    render() {
        return (
            <Knapp mini className="SaveSearchButton" onClick={this.onClick}>Lagre søk</Knapp>
        );
    }
}

SaveSearchButton.defaultProps = {
    currentSavedSearch: undefined
};

SaveSearchButton.propTypes = {
    showTermsOfUse: PropTypes.func.isRequired,
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({}),
    showError: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    hasUser: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isAuthenticated: state.authentication.isAuthenticated,
    hasUser: state.user.hasUser
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace
    }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text }),
    showTermsOfUse: () => dispatch({ type: SHOW_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
