import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './TotalSavedSearch.less';

export default function TotalSavedSearch({ total }) {
    return (
        <div className="TotalSavedSearch">
            <Element className="TotalSavedSearch__label">Antall lagrede søk:</Element>
            <Normaltekst className="TotalSavedSearch__count">
                {total}
            </Normaltekst>
        </div>
    );
}

TotalSavedSearch.propTypes = {
    total: PropTypes.number.isRequired
};
