import React from 'react';
import PropTypes from 'prop-types';
import {Undertittel} from 'nav-frontend-typografi';
import SocialShare from "../socialShare/SocialShare";

export default function ShareAd({ source }) {
    return (
        <div className="ShareAd detail-section">
            <Undertittel className="detail-section__head">Del annonsen</Undertittel>
            <div className="detail-section__body">
                <SocialShare title={source.title} />
            </div>
        </div>
    );
}

ShareAd.propTypes = {
    source: PropTypes.shape({
        title: PropTypes.string
    }).isRequired
};

