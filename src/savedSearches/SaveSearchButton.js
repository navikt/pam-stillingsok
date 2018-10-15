import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';
import { SHOW_AUTHORIZATION_ERROR_MODAL } from '../authorization/authorizationReducer';
import AuthorizationEnum from '../authorization/AuthorizationEnum';

class SaveSearchButton extends React.Component {
    onClick = () => {
        if (!this.props.isLoggedIn) {
            this.props.showError(AuthorizationEnum.SAVE_SEARCH_ERROR);
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
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({}),
    showError: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    isLoggedIn: state.authorization.isLoggedIn
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace
    }),
    showError: (text) => dispatch({ type: SHOW_AUTHORIZATION_ERROR_MODAL, text })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
