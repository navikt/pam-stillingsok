import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';

class SaveSearchButton extends React.Component {
    onClick = () => {
        this.props.showSavedSearchForm(
            this.props.currentSavedSearch ? SavedSearchFormMode.EDIT : SavedSearchFormMode.ADD,
            this.props.currentSavedSearch !== undefined,
            'Tilbake til stillingssøk'
        );
    };

    render() {
        return (
            <Knapp mini onClick={this.onClick}>Lagre søk</Knapp>
        );
    }
}

SaveSearchButton.defaultProps = {
    currentSavedSearch: undefined
};

SaveSearchButton.propTypes = {
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace, cancelButtonText) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace,
        cancelButtonText
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
