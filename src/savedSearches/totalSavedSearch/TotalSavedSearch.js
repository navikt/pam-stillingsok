import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './TotalSavedSearch.less';

export default function TotalSavedSearch({ total }) {
    return (
        <div className="TotalSavedSearch">
            <h2 className="TotalSavedSearch__label">{`Antall lagrede søk: ${total}`}</h2>
        </div>
    );
}

TotalSavedSearch.propTypes = {
    total: PropTypes.number.isRequired
};
