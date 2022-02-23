import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Undertekst } from 'nav-frontend-typografi';
import {formatISOString, isValidEmail, isValidISOString, isValidUrl} from '../../utils';
import './HowToApply.less';
import sendGAEvent from "../../googleanalytics";
import {Hovedknapp} from "@navikt/arbeidsplassen-knapper";
import logAmplitudeEvent from "../../amplitudeTracker";

export function getApplicationUrl(source, properties) {
    if (source === 'FINN') {
        return properties.sourceurl;
    } else if (properties.applicationurl !== undefined) {
        return properties.applicationurl;
    }
    return properties.sourceurl;
}

const applyForPosition  = (finn, stilling) => {
    const eventLabel = `sok-pa-stillingen-${finn ? "finn" : "annen-kilde"}`;
    sendGAEvent(eventLabel);
    try {
        logAmplitudeEvent('Stilling sok-via-url', {
            title: stilling._source.title,
            id: stilling._id,
        })
    } catch (e) {
        // ignore
    }
}

export default function HowToApply({ stilling }) {
    const properties = stilling._source.properties
    const sokUrl = getApplicationUrl(stilling._source.source, properties);
    const finn = stilling._source.source === 'FINN';
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
                            <dd key="dd">{
                                isValidEmail(properties.applicationemail) ?
                                    <a className="link" href={`mailto:${properties.applicationemail}`}>
                                        {properties.applicationemail}
                                    </a>
                                    : properties.applicationemail
                            }</dd>
                        ]}
                        {sokUrl && !isValidUrl(sokUrl) && [
                            <dt key="dt">Søknadslenke:</dt>,
                            <dd key="dd">{sokUrl}</dd>
                        ]}
                    </dl>

                    {sokUrl && isValidUrl(sokUrl) && (
                        <div className="HowToApply__send-button-wrapper">
                            <a
                                href={sokUrl}
                                onClick={() => applyForPosition(finn, stilling)}
                                className="HowToApply__send-button Knapp Knapp--hoved blokk-xxs"
                            >
                                <div className="HowToApply__send-button-content">
                                    <span className="HowToApply__send-button-icon" />Søk på stillingen
                                </div>
                            </a>

                            {finn &&
                            <Undertekst className="blokk-xs"> Denne annonsen er hentet fra{' '}
                                <a
                                    onClick={() => {
                                        sendGAEvent("denne-annonsen-er-hentet-fra-finn" );
                                    }}
                                   href="https://www.finn.no" className="link">FINN.no</a>. Du kan sende søknad via
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
    stilling: PropTypes.shape({
        _id: PropTypes.string,
        _source: PropTypes.shape({
            title: PropTypes.string,
            source: PropTypes.string,
            properties: PropTypes.shape({
                applicationdue: PropTypes.string,
                applicationemail: PropTypes.string,
                applicationurl: PropTypes.string,
                sourceurl: PropTypes.string
            })
        })
    }).isRequired
};

