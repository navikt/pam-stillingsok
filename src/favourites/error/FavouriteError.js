import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import '../alertstripe/FavouriteAlertStripe.less';

class FavouriteError extends React.Component {
    render() {
        if (this.props.error && this.props.httpStatus !== 403) {
            return (
                <AlertStripe type="advarsel" solid className="FavouriteError">
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
            );
        }
        return null;
    }
}

FavouriteError.defaultProps = {
    error: undefined,
    httpStatus: undefined
};

FavouriteError.propTypes = {
    error: PropTypes.string,
    httpStatus: PropTypes.number
};

const mapStateToProps = (state) => ({
    error: state.favourites.error,
    httpStatus: state.favourites.httpErrorStatus
});

export default connect(mapStateToProps)(FavouriteError);
