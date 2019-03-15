import PropTypes from 'prop-types';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Link } from 'react-router-dom';
import './NoSavedSearches.less';

export default function NoSavedSearches({ showButton }) {
    return (
        <div className="NoSavedSearches">
            <Undertittel className="NoSavedSearches__title">Du har ingen lagrede søk</Undertittel>
            <Normaltekst className="NoSavedSearches__message">
                For å lagre et søk må du fylle inn søkeord eller andre kriterier.
                Du kan deretter lagre søket og motta e-postvarsler med nye treff.
            </Normaltekst>
            {showButton && (
                <Link to="/" className="link">Søk etter stillinger</Link>
            )}
        </div>
    );
}

NoSavedSearches.defaultProps = {
    showButton: true
};

NoSavedSearches.propTypes = {
    showButton: PropTypes.bool
};
