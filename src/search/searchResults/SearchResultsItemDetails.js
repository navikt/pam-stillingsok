import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Undertittel, Normaltekst, Undertekst, Element } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';
import './SearchResultsItemDetails.less';
import { STILLING } from '../../fasitProperties';

export default function SearchResultsItemDetails({ stilling }) {
    let frist;
    if (stilling.properties.applicationdue !== undefined) {
        frist = stilling.properties.applicationdue;
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
                {stilling.updated ? (
                    <Undertekst className="SearchResultsItemDetails__updated">
                        Registrert: {formatISOString(stilling.updated, 'D. MMMM YYYY')}{' - '}
                        Søknadsfrist: {frist}
                    </Undertekst>
                ) : (
                    <Undertekst className="SearchResultsItemDetails__updated">
                        Søknadsfrist: {frist}
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
