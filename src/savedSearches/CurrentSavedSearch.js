import { Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

function CurrentSavedSearch({ currentSavedSearch }) {
    if (currentSavedSearch) {
        return (
            <div className="CurrentSavedSearch">
                <Undertekst><b>Lagret søk:</b> {currentSavedSearch.title}</Undertekst>
            </div>
        );
    }
    return <div />;
}

CurrentSavedSearch.defaultProps = {
    currentSavedSearch: undefined
};

CurrentSavedSearch.propTypes = {
    currentSavedSearch: PropTypes.shape({
        title: PropTypes.string
    })
};
const mapStateToProps = (state) => ({
    currentSavedSearch: state.savedSearches.currentSavedSearch
});

export default connect(mapStateToProps)(CurrentSavedSearch);
