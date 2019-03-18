import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import StickyAlertStripe from '../../common/StickyAlertStripe';
import { CONTEXT_PATH } from '../../fasitProperties';
import { SavedSearchAlertStripeMode } from './savedSearchAlertStripeReducer';

function SavedSearchAlertStripe({
    showAlertStripe, alertStripeMode, savedSearchAboutToBeRemoved, formData
}) {
    if (showAlertStripe && (alertStripeMode === SavedSearchAlertStripeMode.ADDED)) {
        return (
            <StickyAlertStripe type="suksess">
                Søket er lagret i <Link className="alertstripe__link" to={`${CONTEXT_PATH}/lagrede-sok`}>Lagrede søk</Link>
            </StickyAlertStripe>
        );
    } else if (showAlertStripe && alertStripeMode === SavedSearchAlertStripeMode.REMOVED) {
        return (
            <StickyAlertStripe type="suksess">
                Lagret søk: {savedSearchAboutToBeRemoved.title} er slettet
            </StickyAlertStripe>
        );
    } else if (showAlertStripe && alertStripeMode === SavedSearchAlertStripeMode.UPDATED) {
        return (
            <StickyAlertStripe type="suksess">
                Lagret søk: {formData.title} er oppdatert
            </StickyAlertStripe>
        );
    }
    return <div />;
}

SavedSearchAlertStripe.defaultProps = {
    savedSearchAboutToBeRemoved: undefined,
    formData: undefined
};

SavedSearchAlertStripe.propTypes = {
    showAlertStripe: PropTypes.bool.isRequired,
    alertStripeMode: PropTypes.string.isRequired,
    savedSearchAboutToBeRemoved: PropTypes.shape({
        title: PropTypes.string
    }),
    formData: PropTypes.shape({
        title: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    showAlertStripe: state.savedSearchAlertStripe.showAlertStripe,
    alertStripeMode: state.savedSearchAlertStripe.alertStripeMode,
    savedSearchAboutToBeRemoved: state.savedSearches.savedSearchAboutToBeRemoved,
    formData: state.savedSearchForm.formData
});

export default connect(mapStateToProps)(SavedSearchAlertStripe);
