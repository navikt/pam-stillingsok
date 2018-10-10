import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import { formatISOString } from '../../utils';

export default function AdDetails({ source }) {
    return (
        <div className="AdDetails detail-section">
            <Undertittel className="AdDetails__head detail-section__head">Om annonsen</Undertittel>
            <dl className="dl-flex typo-normal">
                {source.updated && [
                    <dt key="dt">Sist endret:</dt>,
                    <dd key="dd">{formatISOString(source.updated, 'DD.MM.YYYY')}</dd>
                ]}
                {source.medium && [
                    <dt key="dt">Hentet fra:</dt>,
                    <dd key="dd">{source.medium}</dd>
                ]}
                {source.reference && [
                    <dt key="dt">Referanse:</dt>,
                    <dd key="dd">{source.reference}</dd>
                ]}
                {source.id && [
                    <dt key="dt">Stillingsnummer:</dt>,
                    <dd key="dd">{source.id}</dd>
                ]}
            </dl>
        </div>
    );
}

AdDetails.propTypes = {
    source: PropTypes.shape({
        updated: PropTypes.string,
        medium: PropTypes.string,
        reference: PropTypes.string,
        id: PropTypes.number
    }).isRequired
};

