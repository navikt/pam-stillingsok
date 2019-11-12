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
                <div className="detail-section__body">
                    <dl className="dl-flex typo-normal">
                        {properties.applicationdue && [
                            <dt key="dt">Søknadsfrist:</dt>,
                            <dd key="dd">
                                {isValidISOString(properties.applicationdue) ?
                                    formatISOString(properties.applicationdue, 'DD.MM.YYYY') :
                                    properties.applicationdue}
                            </dd>
                        ]}
                        {!finn && properties.applicationemail && [
                            <dt key="dt">Send søknad til:</dt>,
                            <dd key="dd">{properties.applicationemail}</dd>
                        ]}
                        {sokUrl && !isValidUrl(sokUrl) && [
                            <dt key="dt">Søknadslenke:</dt>,
                            <dd key="dd">{sokUrl}</dd>
                        ]}
                    </dl>

                    {sokUrl && isValidUrl(sokUrl) && (
                        <div className="HowToApply__send-button-wrapper">
                            <a
                                data-ga-id={`sok-pa-stillingen-${finn ? "finn" : "annen-kilde"}`}
                                className="HowToApply__send-button Knapp Knapp--hoved blokk-xxs"
                                href={sokUrl}
                            >
                                <span className="HowToApply__send-button-content">
                                    <span className="HowToApply__send-button-icon" />Søk på stillingen
                                </span>
                            </a>

                            {finn &&
                            <Undertekst className="blokk-xs"> Denne annonsen er hentet fra{' '}
                                <a data-ga-id="denne-annonsen-er-hentet-fra-finn" href="https://www.finn.no" className="link">FINN.no</a>. Du kan sende søknad via
                                den opprinnelige annonsen.
                            </Undertekst>
                            }
                        </div>)
                    }
                </div>
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

