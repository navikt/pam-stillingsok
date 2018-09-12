import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './FavoriteAlertStripe.less';

class FavoriteAlertStripe extends React.Component {
    render() {
        if (this.props.showAlertStripe) {
            return (
                <AlertStripe type="suksess" solid className="FavoriteAlertStripe">
                    Stillingsannonsen er lagret i <Link className="lenke" to="/favoritter">favoritter</Link>
                </AlertStripe>
            );
        }
        return null;
    }
}

FavoriteAlertStripe.propTypes = {
    showAlertStripe: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    showAlertStripe: state.favorites.showAlertStripe
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteAlertStripe);
