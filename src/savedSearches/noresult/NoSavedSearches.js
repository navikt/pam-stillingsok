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
                Når du har laget et søk, kan du et lagre det og motta e-postvarlser på nye treff.
            </Normaltekst>
            {showButton && (
                <Link to="/" className="lenke typo-normal">Søk etter stillinger</Link>
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


