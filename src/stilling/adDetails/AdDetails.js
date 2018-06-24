import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';

export default function AdDetails({ stilling }) {
    const { _source } = stilling;

    return (
        <section className="detail-section">
            <Undertittel className="detail-section__head">Om annonsen</Undertittel>
            <dl className="dl-flex typo-normal">
                {_source.updated && [
                    <dt key="dt">Sist endret:</dt>,
                    <dd key="dd">{formatISOString(_source.updated, 'D. MMMM YYYY')}</dd>
                ]}
                {_source.source && [
                    <dt key="dt">Hentet fra:</dt>,
                    <dd key="dd">{_source.source}</dd>
                ]}
                {_source.reference && [
                    <dt key="dt">ID nr.:</dt>,
                    <dd key="dd">{_source.reference}</dd>
                ]}
            </dl>
        </section>
    );
}

