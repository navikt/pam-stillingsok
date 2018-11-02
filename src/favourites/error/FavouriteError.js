import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import StickyAlertStripe from '../../common/StickyAlertStripe';

function FavouriteError({ error }) {
    if (error) {
        return (
            <StickyAlertStripe type="advarsel">
                {error === 'fetch_error' &&
                    'Klarte ikke å ikke hente favoritter. Forsøk å laste siden på nytt.'
                }
                {error === 'remove_error' &&
                    'Klarte ikke å slette favoritt. Forsøk å laste siden på nytt.'
                }
                {error === 'add_error' &&
                    'Klarte ikke å lagre favoritt. Forsøk å laste siden på nytt.'
                }
            </StickyAlertStripe>
        );
    }
    return <div />;
}

FavouriteError.defaultProps = {
    error: undefined
};

FavouriteError.propTypes = {
    error: PropTypes.string
};

const mapStateToProps = (state) => ({
    error: state.favourites.error
});

export default connect(mapStateToProps)(FavouriteError);
