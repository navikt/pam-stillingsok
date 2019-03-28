import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'pam-frontend-knapper';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';

class SaveSearchButton extends React.Component {
    onClick = () => {
        this.props.showSavedSearchForm(
            this.props.currentSavedSearch ? SavedSearchFormMode.REPLACE : SavedSearchFormMode.ADD,
            this.props.currentSavedSearch !== undefined
        );
    };

    render() {
        return this.props.canSaveSearch ? (
            <Knapp mini className="SaveSearchButton" onClick={this.onClick}>Lagre søk</Knapp>
        ) : (
            <HjelpetekstBase
                type="over"
                id="hjelpetekstLagreknapp"
                anchor={() => (
                    <div role="button" className="Knapp Knapp--mini Knapp--disabled SaveSearchButton">
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
    currentSavedSearch: undefined
};

SaveSearchButton.propTypes = {
    showSavedSearchForm: PropTypes.func.isRequired,
    currentSavedSearch: PropTypes.shape({}),
    canSaveSearch: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch,
    canSaveSearch: state.savedSearches.canSaveSearch
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
