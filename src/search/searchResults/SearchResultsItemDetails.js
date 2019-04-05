import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import getEmployer from '../../common/getEmployer';
import getWorkLocation from '../../common/getWorkLocation';
import { CONTEXT_PATH } from '../../fasitProperties';
import { formatISOString, isValidISOString } from '../../utils';
import './SearchResultsItemDetails.less';

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

    return (
        <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`} className="SearchResultItem__link">
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
                    <Normaltekst className="SearchResultsItemDetails__applicationdue">
                        Søknadsfrist: {frist}
                    </Normaltekst>
                </Column>
            </Row>
        </Link>
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
