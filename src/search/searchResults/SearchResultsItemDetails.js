import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { CONTEXT_PATH } from '../../fasitProperties';
import { formatISOString, isValidISOString } from '../../utils';
import getWorkLocation from '../../common/getWorkLocation';
import getEmployer from '../../common/getEmployer';
import './SearchResultsItemDetails.less';

export default function SearchResultsItemDetails({ stilling, inlineLink }) {
    let frist;
    const { applicationdue } = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, 'DD.MM.YYYY') : applicationdue;
    } else {
        frist = 'Ikke oppgitt';
    }
    const location = getWorkLocation(stilling, true);
    const employer = getEmployer(stilling);

    return (
        <Row className="SearchResultsItemDetails">
            <Column xs="12" md="4">
                {employer && (
                    <Element className="SearchResultsItemDetails__employer">
                        {employer}
                    </Element>
                )}
            </Column>
            <Column xs="12" md="8">
                {stilling.published && (
                    <Undertekst className="SearchResultsItemDetails__published">
                        {formatISOString(stilling.published, 'DD.MM.YYYY')}
                    </Undertekst>
                )}

                <Undertittel tag="h3" className="SearchResultsItemDetails__title">
                    {inlineLink ? (
                        <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`} className="SearchResultsItemDetails__title__lenke lenke">
                            {stilling.title}
                        </Link>
                    ) : stilling.title}
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
    );
}

SearchResultsItemDetails.defaultProps = {
    inlineLink: true
};

SearchResultsItemDetails.propTypes = {
    inlineLink: PropTypes.bool,
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        published: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string
        })
    }).isRequired
};
