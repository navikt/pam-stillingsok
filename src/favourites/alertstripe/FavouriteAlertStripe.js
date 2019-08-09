import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import StickyAlertStripe from '../../common/components/StickyAlertStripe';
import { CONTEXT_PATH } from '../../fasitProperties';

function FavouriteAlertStripe({ showAlertStripe, alertStripeMode }) {
    if (showAlertStripe && (alertStripeMode === 'added')) {
        return (
            <StickyAlertStripe type="suksess">
                <span>
                    Stillingsannonsen er lagret i <Link className="link link--dark" to={`${CONTEXT_PATH}/favoritter`}>favoritter</Link>
                </span>
            </StickyAlertStripe>
        );
    } else if (showAlertStripe && alertStripeMode === 'removed') {
        return (
            <StickyAlertStripe type="suksess">
                Favoritten er slettet
            </StickyAlertStripe>
        );
    }
    return <div />;
}

FavouriteAlertStripe.propTypes = {
    showAlertStripe: PropTypes.bool.isRequired,
    alertStripeMode: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    showAlertStripe: state.favourites.showAlertStripe,
    alertStripeMode: state.favourites.alertStripeMode
});

export default connect(mapStateToProps)(FavouriteAlertStripe);
