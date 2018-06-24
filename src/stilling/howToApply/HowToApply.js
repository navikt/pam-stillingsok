import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { formatISOString, isValidISOString } from '../../utils';
import './HowToApply.less';

export const tilpassEmail = (email) => {
    if (email.includes('@') && !email.includes('mailto:')) {
        return `mailto:${email}`;
    }
    return email;
};

export function getApplicationUrl(source, properties) {
    if (source === 'FINN') {
        return properties.sourceurl;
    } else if (properties.applicationurl !== undefined) {
        return properties.applicationurl;
    }
    return properties.sourceurl;
}

export default function HowToApply({ source, properties }) {
    const sokUrl = getApplicationUrl(source, properties);

    if (properties.applicationdue || properties.applicationemail || sokUrl) {
        return (
            <div className="detail-section">
                <Undertittel className="detail-section__head">Søknad</Undertittel>
                <dl className="dl-flex typo-normal">
                    {properties.applicationdue && [
                        <dt key="dt">Søknadsfrist:</dt>,
                        <dd key="dd">
                            {isValidISOString(properties.applicationdue) ?
                                formatISOString(properties.applicationdue, 'D. MMMM YYYY') :
                                properties.applicationdue}
                        </dd>
                    ]}
                    {properties.applicationemail && [
                        <dt key="dt">Send søknad til:</dt>,
                        <dd key="dd">
                            <a
                                className="lenke"
                                href={tilpassEmail(properties.applicationemail)}
                            >
                                {properties.applicationemail}
                            </a>
                        </dd>
                    ]}
                </dl>

                {sokUrl && (
                    <div className="HowToApply__send-button-wrapper">
                        <a
                            className="knapp knapp--hoved"
                            href={sokUrl}
                        >
                            Send søknad
                        </a>
                    </div>
                )}
            </div>
        );
    }
    return null;
}

HowToApply.propTypes = {
    source: PropTypes.string.isRequired,
    properties: PropTypes.shape({
        applicationdue: PropTypes.string,
        applicationemail: PropTypes.string,
        applicationurl: PropTypes.string,
        sourceurl: PropTypes.string
    }).isRequired
};

