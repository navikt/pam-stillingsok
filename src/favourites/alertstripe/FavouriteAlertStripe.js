import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './FavouriteAlertStripe.less';
import SnapToTop from '../../common/SnapToTop';

function FavouriteAlertStripe({ showAlertStripe, alertStripeMode }) {
    if (showAlertStripe && (alertStripeMode === 'added')) {
        return (
            <SnapToTop inlineClassName="FavouriteAlertStripeSnapToTop">
                <AlertStripe type="suksess" solid className="FavouriteAlertStripe">
                    Stillingsannonsen er lagret i <Link className="lenke" to="/favoritter">favoritter</Link>
                </AlertStripe>
            </SnapToTop>
        );
    } else if (showAlertStripe && alertStripeMode === 'removed') {
        return (
            <SnapToTop inlineClassName="FavouriteAlertStripeSnapToTop">
                <AlertStripe type="suksess" solid className="FavouriteAlertStripe">
                    Favoritten er slettet
                </AlertStripe>
            </SnapToTop>
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
