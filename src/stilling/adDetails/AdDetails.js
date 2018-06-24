import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';

export default function AdDetails({ source }) {
    return (
        <section className="detail-section">
            <Undertittel className="detail-section__head">Om annonsen</Undertittel>
            <dl className="dl-flex typo-normal">
                {source.updated && [
                    <dt key="dt">Sist endret:</dt>,
                    <dd key="dd">{formatISOString(source.updated, 'D. MMMM YYYY')}</dd>
                ]}
                {source.source && [
                    <dt key="dt">Hentet fra:</dt>,
                    <dd key="dd">{source.source}</dd>
                ]}
                {source.reference && [
                    <dt key="dt">ID nr.:</dt>,
                    <dd key="dd">{source.reference}</dd>
                ]}
            </dl>
        </section>
    );
}

AdDetails.propTypes = {
    source: PropTypes.shape({
        updated: PropTypes.string,
        source: PropTypes.string,
        reference: PropTypes.string
    }).isRequired
};

