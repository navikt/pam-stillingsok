import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './SavedSearchesAlertStripe.less';
import SnapToTop from '../common/SnapToTop';

function SavedSearchesAlertStripe({
    showAlertStripe, alertStripeMode, savedSearchAboutToBeRemoved,
    savedSearchAboutToBeEdited
}) {
    if (showAlertStripe && (alertStripeMode === 'added')) {
        return (
            <SnapToTop>
                <AlertStripe type="suksess" solid className="SavedSearchesAlertStripe">
                    Søket er lagret i <Link className="lenke" to="/lagrede-sok">Lagrede søk</Link>
                </AlertStripe>
            </SnapToTop>
        );
    } else if (showAlertStripe && alertStripeMode === 'removed') {
        return (
            <SnapToTop>
                <AlertStripe type="suksess" solid className="SavedSearchesAlertStripe">
                    Lagret søk: {savedSearchAboutToBeRemoved.title} er slettet
                </AlertStripe>
            </SnapToTop>
        );
    } else if (showAlertStripe && alertStripeMode === 'updated') {
        return (
            <SnapToTop>
                <AlertStripe type="suksess" solid className="SavedSearchesAlertStripe">
                    Lagret søk: {savedSearchAboutToBeEdited.title} er oppdatert
                </AlertStripe>
            </SnapToTop>
        );
    }
    return <div />;
}

SavedSearchesAlertStripe.defaultProps = {
    savedSearchAboutToBeRemoved: undefined,
    savedSearchAboutToBeEdited: undefined
};

SavedSearchesAlertStripe.propTypes = {
    showAlertStripe: PropTypes.bool.isRequired,
    alertStripeMode: PropTypes.string.isRequired,
    savedSearchAboutToBeRemoved: PropTypes.shape({
        title: PropTypes.string
    }),
    savedSearchAboutToBeEdited: PropTypes.shape({
        title: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    showAlertStripe: state.savedSearches.showAlertStripe,
    alertStripeMode: state.savedSearches.alertStripeMode,
    savedSearchAboutToBeRemoved: state.savedSearches.savedSearchAboutToBeRemoved,
    savedSearchAboutToBeEdited: state.savedSearches.savedSearchAboutToBeEdited
});

export default connect(mapStateToProps)(SavedSearchesAlertStripe);
