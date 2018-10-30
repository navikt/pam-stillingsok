import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Undertittel, Normaltekst, Undertekst, Element } from 'nav-frontend-typografi';
import { formatISOString, isValidISOString } from '../../utils';
import './SearchResultsItemDetails.less';
import { STILLING } from '../../fasitProperties';

export default function SearchResultsItemDetails({ stilling }) {
    let frist;
    const { applicationdue } = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, 'DD.MM.YYYY') : applicationdue;
    } else {
        frist = 'Ikke oppgitt';
    }

    return (
        <Row className="SearchResultsItemDetails">
            <Column xs="12" md="4">
                {stilling.properties.employer && (
                    <Normaltekst className="SearchResultsItemDetails__employer">
                        {stilling.properties.employer}
                    </Normaltekst>
                )}
            </Column>
            <Column xs="12" md="8">
                {stilling.updated && (
                    <Undertekst className="SearchResultsItemDetails__updated">
                        {formatISOString(stilling.updated, 'DD.MM.YYYY')}
                    </Undertekst>
                )}

                <Undertittel tag="h3" className="SearchResultsItemDetails__title">
                    <Link to={`${STILLING}${stilling.uuid}`} className="lenke">
                        {stilling.title}
                    </Link>
                </Undertittel>
                {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                    <Element
                        className="SearchResultsItemDetails__jobtitle"
                    >
                        {stilling.properties.jobtitle}
                    </Element>
                )}

                {stilling.properties.location && (
                    <Normaltekst className="SearchResultsItemDetails__location">
                        {stilling.properties.location}
                    </Normaltekst>
                )}
                <Normaltekst className="SearchResultsItemDetails__applicationdue">
                    Søknadsfrist: {frist}
                </Normaltekst>
            </Column>
        </Row>
    );
}

SearchResultsItemDetails.propTypes = {
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        updated: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string
        })
    }).isRequired
};
