import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './TotalFavourites.less';

export default function TotalFavourites({ total }) {
    return (
        <div className="TotalFavourites">
            <Element className="TotalFavourites__label">Antall annonser:</Element>
            <Normaltekst className="TotalFavourites__count">
                {total}
            </Normaltekst>
        </div>
    );
}

TotalFavourites.propTypes = {
    total: PropTypes.number.isRequired
};
