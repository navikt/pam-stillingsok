import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './FavouriteAlertStripe.less';

function FavouriteAlertStripe({ showAlertStripe, alertStripeMode }) {
    if (showAlertStripe && (alertStripeMode === 'added')) {
        return (
            <AlertStripe type="suksess" solid className="FavouriteAlertStripe">
                    Stillingsannonsen er lagret i <Link className="lenke" to="/favoritter">favoritter</Link>
            </AlertStripe>
        );
    } else if (showAlertStripe && alertStripeMode === 'removed') {
        return (
            <AlertStripe type="suksess" solid className="FavouriteAlertStripe">
                    Favoritten er slettet
            </AlertStripe>
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
