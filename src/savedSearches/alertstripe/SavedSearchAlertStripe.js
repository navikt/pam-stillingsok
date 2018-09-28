import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './SavedSearchAlertStripe.less';
import SnapToTop from '../../common/SnapToTop';
import { SavedSearchAlertStripeMode } from './savedSearchAlertStripeReducer';

function SavedSearchAlertStripe({
    showAlertStripe, alertStripeMode, savedSearchAboutToBeRemoved, formData
}) {
    if (showAlertStripe && (alertStripeMode === SavedSearchAlertStripeMode.ADDED)) {
        return (
            <SnapToTop inlineClassName="SavedSearchAlertStripeSnapToTop">
                <AlertStripe type="suksess" solid className="SavedSearchAlertStripe">
                    Søket er lagret i <Link className="lenke" to="/lagrede-sok">Lagrede søk</Link>
                </AlertStripe>
            </SnapToTop>
        );
    } else if (showAlertStripe && alertStripeMode === SavedSearchAlertStripeMode.REMOVED) {
        return (
            <SnapToTop inlineClassName="SavedSearchAlertStripeSnapToTop">
                <AlertStripe type="suksess" solid className="SavedSearchAlertStripe">
                    Lagret søk: {savedSearchAboutToBeRemoved.title} er slettet
                </AlertStripe>
            </SnapToTop>
        );
    } else if (showAlertStripe && alertStripeMode === SavedSearchAlertStripeMode.UPDATED) {
        return (
            <SnapToTop inlineClassName="SavedSearchAlertStripeSnapToTop">
                <AlertStripe type="suksess" solid className="SavedSearchAlertStripe">
                    Lagret søk: {formData.title} er oppdatert
                </AlertStripe>
            </SnapToTop>
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
