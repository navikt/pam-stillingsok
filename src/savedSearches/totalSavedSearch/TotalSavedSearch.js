import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './TotalSavedSearch.less';

export default function TotalSavedSearch({ total }) {
    return (
        <div className="TotalSavedSearch">
            <h2 className="TotalSavedSearch__label">{total !== 1 ? `${total} lagrede søk` : '1 lagret søk'}</h2>
        </div>
    );
}

TotalSavedSearch.propTypes = {
    total: PropTypes.number.isRequired
};
