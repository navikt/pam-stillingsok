import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import './FavoriteAlertStripe.less';

class FavoriteError extends React.Component {
    render() {
        if (this.props.error) {
            return (
                <AlertStripe type="advarsel" solid className="FavoriteError">
                    Det oppso en feil ved lagring av favoritter. Forsøk å laste siden på nytt.
                </AlertStripe>
            );
        }
        return null;
    }
}

FavoriteError.defaultProps = {
    error: undefined
};

FavoriteError.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string,
        statusCode: PropTypes.number
    })
};

const mapStateToProps = (state) => ({
    error: state.favorites.error
});

export default connect(mapStateToProps)(FavoriteError);
