import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import SnapToTop from '../common/SnapToTop';
import './FavoriteAlertStripe.less';

class FavoriteError extends React.Component {
    render() {
        if (this.props.error) {
            return (
                <SnapToTop>
                    <AlertStripe type="advarsel" solid className="FavoriteError">
                        {this.props.error === 'fetch_error' &&
                        'Klarte ikke å ikke hente favoritter. Forsøk å laste siden på nytt.'
                        }
                        {this.props.error === 'remove_error' &&
                        'Klarte ikke å slette favoritt. Forsøk å laste siden på nytt.'
                        }
                        {this.props.error === 'add_error' &&
                        'Klarte ikke å lagre favoritt. Forsøk å laste siden på nytt.'
                        }
                    </AlertStripe>
                </SnapToTop>
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
