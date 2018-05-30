import React from 'react';
import { Ingress } from 'nav-frontend-typografi';

export default function NoSearchResults() {
    return (
        <div id="no-results">
            <Ingress>Vi fant ingen ledige stillinger som matcher søket ditt.</Ingress>
        </div>
    );
}
