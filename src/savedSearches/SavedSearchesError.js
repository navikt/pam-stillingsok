import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import SnapToTop from '../common/SnapToTop';
import './SavedSearchesAlertStripe.less';

class SavedSearchesError extends React.Component {
    render() {
        if (this.props.error) {
            return (
                <SnapToTop>
                    <AlertStripe type="advarsel" solid className="SavedSearchesError">
                        {this.props.error === 'fetch_error' &&
                        'Klarte ikke å ikke hente lagrede søk. Forsøk å laste siden på nytt.'
                        }
                        {this.props.error === 'remove_error' &&
                        'Klarte ikke å slette søk. Forsøk å laste siden på nytt.'
                        }
                        {this.props.error === 'update_error' &&
                        'Klarte ikke å oppdatere søk. Forsøk å laste siden på nytt.'
                        }
                        {this.props.error === 'add_error' &&
                        'Klarte ikke å lagre søk. Forsøk å laste siden på nytt.'
                        }
                    </AlertStripe>
                </SnapToTop>
            );
        }
        return null;
    }
}

SavedSearchesError.defaultProps = {
    error: undefined
};

SavedSearchesError.propTypes = {
    error: PropTypes.string
};

const mapStateToProps = (state) => ({
    error: state.savedSearches.error
});

export default connect(mapStateToProps)(SavedSearchesError);
