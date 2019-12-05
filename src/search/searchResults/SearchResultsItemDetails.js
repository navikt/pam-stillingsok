import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import getEmployer from '../../../server/common/getEmployer';
import getWorkLocation from '../../../server/common/getWorkLocation';
import { CONTEXT_PATH } from '../../fasitProperties';
import { formatISOString, isValidISOString } from '../../utils';
import './SearchResultsItemDetails.less';

const trackTest = (testVersion, source) => {
    let action;
    if (testVersion === 'a') {
        action = "Åpnet annonse (Test A - Intern visning)"
    } else if (testVersion === 'b') {
        action = "Åpnet annonse (Test B - Ekstern visning, samme fane)"
    } else if (testVersion === 'c') {
        action = "Åpnet annonse (Test C - Ekstern visning, ny fane)"
    } else {
        action = "Åpnet annonse"
    }

    ga('send', 'event', {
        eventCategory: 'Ledige stillinger > Lenketest',
        eventAction: action,
        eventLabel: source,
        transport: 'beacon'
    });
};


export function getTestVersion() {
    if (window.testVersion === undefined) {
        try {
            let stored = localStorage.getItem("linkTestVersion");
            if (stored && (stored === 'a' || stored === 'b' || stored === 'c')) {
                window.testVersion = stored;
            } else {
                stored = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
                localStorage.setItem("linkTestVersion", stored);
                window.testVersion = stored;
            }
        } catch (e) {
            window.testVersion = 'a';
        }
    }
    return window.testVersion;
}

function LinkTestVersion({ children, stilling, isFinn, testVersion }) {
    if (isFinn && testVersion === 'c') {
        return (
            <a href={`https://www.finn.no/${stilling.reference}`} className="SearchResultItem__link" target="_blank"
               onClick={() => {
                   trackTest(testVersion, "finn")
               }}>
                {children}
            </a>
        )
    }
    if (isFinn && testVersion === 'b') {
        return (
            <a href={`https://www.finn.no/${stilling.reference}`} className="SearchResultItem__link" onClick={() => {
                trackTest(testVersion, "finn")
            }}>
                {children}
            </a>
        )
    }
    return (
        <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`} className="SearchResultItem__link" onClick={() => {
            trackTest(testVersion, isFinn ? "finn" : "annen-kilde")
        }}>
            {children}
        </Link>
    )
}

export default function SearchResultsItemDetails({ stilling }) {
    let frist;
    const { applicationdue } = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, 'DD.MM.YYYY') : applicationdue;
    } else {
        frist = 'Ikke oppgitt';
    }
    const location = getWorkLocation(stilling.properties.location, stilling.locationList);
    const employer = getEmployer(stilling);
    const testVersion = getTestVersion();
    const isFinn = stilling.source && stilling.source.toLowerCase() === "finn";

    return (
        <LinkTestVersion testVersion={testVersion} stilling={stilling} isFinn={isFinn}>
            <Row className="SearchResultsItemDetails">
                <Column xs="12" md="4">
                    {employer && (
                        <Normaltekst className="SearchResultsItemDetails__employer">
                            {employer}
                        </Normaltekst>
                    )}
                </Column>
                <Column xs="12" md="8">
                    {stilling.published && (
                        <Undertekst className="SearchResultsItemDetails__published">
                            {formatISOString(stilling.published, 'DD.MM.YYYY')}
                        </Undertekst>
                    )}

                    <Undertittel tag="h3" className="SearchResultsItemDetails__title">
                        {stilling.title}
                    </Undertittel>
                    {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                        <Normaltekst
                            className="SearchResultsItemDetails__jobtitle"
                        >
                            {stilling.properties.jobtitle}
                        </Normaltekst>
                    )}

                    {location && (
                        <Normaltekst className="SearchResultsItemDetails__location">
                            {location}
                        </Normaltekst>
                    )}
                    <div className="SearchResultsItemDetails__applicationdue-wrapper">
                        <Normaltekst className="SearchResultsItemDetails__applicationdue">
                            Søknadsfrist: {frist}
                        </Normaltekst>
                        {isFinn && (testVersion === 'b' || testVersion === 'c') && (
                            <Normaltekst className="SearchResultsItemDetails__external-link">
                                Annonsen åpnes på FINN <span className="SearchResultsItemDetails__external-link-icon" aria-label="Ekstern lenke" />
                            </Normaltekst>
                        )}
                    </div>
                </Column>
            </Row>
        </LinkTestVersion>
    );
}

SearchResultsItemDetails.propTypes = {
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        published: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string
        }),
        locationList: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};
