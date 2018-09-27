import { Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

function CurrentSavedSearch({ currentSavedSearch }) {
    if (currentSavedSearch) {
        return (
            <div>
                <Normaltekst>Lagret søk: {currentSavedSearch.title}</Normaltekst>
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
