import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './FavoriteAlertStripe.less';
import SnapToTop from '../common/SnapToTop';

function FavoriteAlertStripe({ showAlertStripe, alertStripeMode }) {
    if (showAlertStripe && (alertStripeMode === 'added')) {
        return (
            <SnapToTop>
                <AlertStripe type="suksess" solid className="FavoriteAlertStripe">
                    Stillingsannonsen er lagret i <Link className="lenke" to="/favoritter">favoritter</Link>
                </AlertStripe>
            </SnapToTop>
        );
    } else if (showAlertStripe && alertStripeMode === 'removed') {
        return (
            <SnapToTop>
                <AlertStripe type="suksess" solid className="FavoriteAlertStripe">
                    Favoritten er slettet
                </AlertStripe>
            </SnapToTop>
        );
    }
    return <div/>;
}

FavoriteAlertStripe.propTypes = {
    showAlertStripe: PropTypes.bool.isRequired,
    alertStripeMode: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    showAlertStripe: state.favorites.showAlertStripe,
    alertStripeMode: state.favorites.alertStripeMode
});

export default connect(mapStateToProps)(FavoriteAlertStripe);
