import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AuthorizationEnum from '../user/AuthorizationEnum';
import { SHOW_AUTHORIZATION_ERROR_MODAL, SHOW_TERMS_OF_USE_MODAL } from '../user/userReducer';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';

class SaveSearchButton extends React.Component {
    onClick = () => {
        const { isAuthenticated, showError, user, showTermsOfUseModal, showSavedSearchForm, currentSavedSearch } = this.props;
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

    shouldBeDisabled = () => {
        const { searchBoxValue, searchIsNonEmpty } = this.props;
        return searchBoxValue.length === 0 && !searchIsNonEmpty;
    };

    render() {
        return (
            <Knapp mini className="SaveSearchButton" onClick={this.onClick} disabled={this.shouldBeDisabled()}>Lagre søk</Knapp>
        );
    }
}

SaveSearchButton.defaultProps = {
    currentSavedSearch: undefined,
    user: undefined,
    isAuthenticated: undefined,
    searchIsNonEmpty: undefined,
    searchBoxValue: undefined
};

SaveSearchButton.propTypes = {
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({}),
    showError: PropTypes.func.isRequired,
    showTermsOfUseModal: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    searchIsNonEmpty: PropTypes.bool,
    searchBoxValue: PropTypes.string,
    user: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isAuthenticated: state.user.isAuthenticated,
    searchIsNonEmpty: state.search.searchIsNonEmpty,
    searchBoxValue: state.searchBox.q,
    user: state.user.user
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
