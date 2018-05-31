import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';
import { STILLING } from '../../fasitProperties';
import './SearchResultsItem.less';

export default function SearchResultItem(props) {
    const { stilling } = props;
    return (
        <Link
            className="SearchResultItem"
            to={`${STILLING}${stilling.uuid}`}
            aria-label={`${stilling.title} hos ${stilling.properties.employer}`}
        >
            <Row className="SearchResultItem__inner">
                <Column xs="4" className="SearchResultItem__inner__arbeidsgiver">
                    {stilling.properties.employer && (
                        <Normaltekst className="break-word">{stilling.properties.employer}</Normaltekst>
                    ) }
                </Column>
                <Column xs="8">
                    {stilling.updated && (
                        <Normaltekst className="blokk-s break-word muted">
                            {formatISOString(stilling.updated, 'D. MMMM YYYY')}
                        </Normaltekst>
                    ) }

                    <h3 className="typo-ingress blokk-s break-word">{stilling.title}</h3>

                    {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                        <Element className="break-word">{stilling.properties.jobtitle}</Element>
                    ) }

                    {stilling.properties.employer && (
                        <Normaltekst className="break-word">{stilling.properties.employer}</Normaltekst>
                    ) }

                    {stilling.properties.location && (
                        <Normaltekst className="break-word">{stilling.properties.location}</Normaltekst>
                    ) }
                </Column>
            </Row>
        </Link>
    );
}

SearchResultItem.propTypes = {
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            updated: PropTypes.string
        })
    }).isRequired
};
