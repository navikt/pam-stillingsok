import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../fasitProperties';
import StickyAlertStripe from '../common/StickyAlertStripe';

function UserAlertStripe({ userAlertStripeMode, userAlertStripeIsVisible }) {
    if (userAlertStripeIsVisible && (userAlertStripeMode === 'added')) {
        return (
            <StickyAlertStripe type="suksess">
                Din e-postadresse er lagret på <Link className="lenke" to={`${CONTEXT_PATH}/minside`}>min side</Link>
            </StickyAlertStripe>
        );
    } else if (userAlertStripeIsVisible && userAlertStripeMode === 'changed') {
        return (
            <StickyAlertStripe type="suksess">
                E-postadressen din ble endret
            </StickyAlertStripe>
        );
    }
    return <div />;
}

UserAlertStripe.propTypes = {
    userAlertStripeIsVisible: PropTypes.bool.isRequired,
    userAlertStripeMode: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    userAlertStripeIsVisible: state.user.userAlertStripeIsVisible,
    userAlertStripeMode: state.user.userAlertStripeMode
});

export default connect(mapStateToProps)(UserAlertStripe);
