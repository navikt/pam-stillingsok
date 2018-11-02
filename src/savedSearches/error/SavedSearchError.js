import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import StickyAlertStripe from '../../common/StickyAlertStripe';
import { SavedSearchErrorEnum } from './savedSearchErrorReducer';

function SavedSearchError({ error }) {
    if (error) {
        return (
            <StickyAlertStripe type="advarsel">
                {error === SavedSearchErrorEnum.FETCH_ERROR &&
                    'Klarte ikke å ikke hente lagrede søk. Forsøk å laste siden på nytt.'
                }
                {error === SavedSearchErrorEnum.REMOVE_ERROR &&
                    'Klarte ikke å slette søk. Forsøk å laste siden på nytt.'
                }
                {error === SavedSearchErrorEnum.UPDATE_ERROR &&
                    'Klarte ikke å oppdatere søk. Forsøk å laste siden på nytt.'
                }
                {error === SavedSearchErrorEnum.ADD_ERROR &&
                    'Klarte ikke å lagre søk. Forsøk å laste siden på nytt.'
                }
            </StickyAlertStripe>
        );
    }
    return <div />;
}

SavedSearchError.defaultProps = {
    error: undefined
};

SavedSearchError.propTypes = {
    error: PropTypes.string
};

const mapStateToProps = (state) => ({
    error: state.savedSearchError.error
});

export default connect(mapStateToProps)(SavedSearchError);
