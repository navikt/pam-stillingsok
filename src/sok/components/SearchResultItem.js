import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';
import StillingPropTypes from '../search/propstypes/StillingPropTypes';
import { STILLING } from "../../fasitProperties";

function keepScrollPosition() {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    try {
        sessionStorage.setItem('lastScrollPosition', top);
    } catch (e) {
        // Do nothing
    }
}

export default function SearchResultItem(props) {
    const { stilling } = props;
    return (
        <Link
            className="search-result-item-link"
            to={`${STILLING}${stilling.uuid}`}
            aria-label={`${stilling.title} hos ${stilling.properties.employer}`}
            onClick={keepScrollPosition}
        >
            <Row className="search-result-item">
                <Column xs="4" className="search-result-item__arbeidsgiver">
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
    stilling: StillingPropTypes.isRequired
};
