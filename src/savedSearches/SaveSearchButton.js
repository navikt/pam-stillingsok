import HjelpetekstBase from 'nav-frontend-hjelpetekst';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from '../common/button';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM } from './form/savedSearchFormReducer';

const SaveSearchButton = withRouter((props) => {
    const {
        canSaveSearch,
        currentSavedSearch,
        history,
        showSavedSearchForm,
        user
    } = props;

    const onClick = () => {
        if (user) {
            showSavedSearchForm(
                currentSavedSearch ? SavedSearchFormMode.REPLACE : SavedSearchFormMode.ADD,
                currentSavedSearch !== undefined
            );
        } else {
            history.push('/stillinger/samtykke');
        }
    };

    return canSaveSearch ? (
        <Button mini className="SaveSearchButton" onClick={onClick}>Lagre søk</Button>
    ) : (
        <HjelpetekstBase
            type="over"
            id="hjelpetekstLagreknapp"
            anchor={() => (
                <div role="button" className="Button Button--mini Button--disabled SaveSearchButton">
                    Lagre søk
                </div>
            )}
            tittel="Du må fylle inn søkeord eller kriterier for å kunne lagre."
        >
            Du må fylle inn søkeord eller kriterier for å kunne lagre.
        </HjelpetekstBase>
    );
});

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
    canSaveSearch: state.savedSearches.canSaveSearch,
    user: state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    showSavedSearchForm: (formMode, showAddOrReplace) => dispatch({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode,
        showAddOrReplace
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(SaveSearchButton);
