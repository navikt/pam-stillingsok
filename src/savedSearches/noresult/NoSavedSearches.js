import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './NoSavedSearches.less';

export default function NoSavedSearches() {
    return (
        <div className="NoSavedSearches">
            <Undertittel>Du har ingen lagrede søk</Undertittel>
            <Normaltekst>Du kan lagre et søk ved å trykke på Lagre søk</Normaltekst>
        </div>
    );
}

