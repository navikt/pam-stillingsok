import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../fasitProperties';
import StickyAlertStripe from '../common/StickyAlertStripe';

function UserAlertStripe({ termsAlertStripeIsVisible, userAlertStripeMode, userAlertStripeIsVisible }) {
    if (userAlertStripeIsVisible && (userAlertStripeMode === 'added')) {
        return (
            <StickyAlertStripe type="suksess">
                {'Din e-postadresse er lagret på '}
                <Link
                    className="lenke"
                    to={`${CONTEXT_PATH}/innstillinger`}
                >
                    Innstillinger
                </Link>
            </StickyAlertStripe>
        );
    }

    if (userAlertStripeIsVisible && userAlertStripeMode === 'set-email') {
        return (
            <StickyAlertStripe type="suksess">
                Din e-postadresse er lagret
            </StickyAlertStripe>
        );
    }

    if (userAlertStripeIsVisible && userAlertStripeMode === 'clear-email') {
        return (
            <StickyAlertStripe type="suksess">
                E-postadressen din ble slettet
            </StickyAlertStripe>
        );
    } else if (termsAlertStripeIsVisible) {
        return (
            <StickyAlertStripe type="stopp">
                Kunne ikke hente samtykketekst
            </StickyAlertStripe>
        );
    }

    if (termsAlertStripeIsVisible) {
        return (
            <StickyAlertStripe type="advarsel">
                Kunne ikke hente samtykketekst
            </StickyAlertStripe>
        );
    }

    return null;
}

UserAlertStripe.propTypes = {
    termsAlertStripeIsVisible: PropTypes.bool.isRequired,
    userAlertStripeIsVisible: PropTypes.bool.isRequired,
    userAlertStripeMode: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    termsAlertStripeIsVisible: state.user.termsAlertStripeIsVisible,
    userAlertStripeIsVisible: state.user.userAlertStripeIsVisible,
    userAlertStripeMode: state.user.userAlertStripeMode
});

export default connect(mapStateToProps)(UserAlertStripe);
