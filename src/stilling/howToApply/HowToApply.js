import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';
import { formatISOString, isValidISOString, isValidUrl } from '../../utils';
import './HowToApply.less';

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
    const finn = source === 'FINN';
    if (properties.applicationdue || properties.applicationemail || sokUrl) {
        return (
            <div className="HowToApply detail-section">
                <Undertittel className="HowToApply__head detail-section__head">Søknad</Undertittel>
                <dl className="dl-flex typo-normal">
                    {properties.applicationdue && [
                        <dt key="dt">Søknadsfrist:</dt>,
                        <dd key="dd">
                            {isValidISOString(properties.applicationdue) ?
                                formatISOString(properties.applicationdue, 'D. MMMM YYYY') :
                                properties.applicationdue}
                        </dd>
                    ]}
                    {!finn && properties.applicationemail && [
                        <dt key="dt">Send søknad til:</dt>,
                        <dd key="dd">{properties.applicationemail}</dd>
                    ]}
                </dl>

                {sokUrl && isValidUrl(sokUrl) ? (
                    <div className="HowToApply__send-button-wrapper">
                        <a
                            className="HowToApply__send-button knapp knapp--hoved blokk-xxs"
                            href={sokUrl}
                        >
                            <div className="HowToApply__send-button-content">
                                <i className="HowToApply__send-button-icon"/>Søk på stillingen
                            </div>
                        </a>

                        {finn &&
                            <Undertekst className="blokk-xs"> Denne annonsen er hentet fra{' '}
                                <a href="https://www.finn.no" className="lenke">FINN.no</a>. Du kan sende søknad via
                                den opprinnelige annonsen.
                            </Undertekst>
                        }
                    </div>)
                    : (
                        <dl className="dl-flex typo-normal">
                            <dt key="dt">Søknadslenke:</dt>
                            <dd key="dd">{sokUrl}</dd>
                        </dl>
                    )
                }
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

