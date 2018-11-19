import React from 'react';
import { Ingress } from 'nav-frontend-typografi';
import './NoResults.less';

export default function NoResults() {
    return (
        <div className="NoResults">
            <Ingress>Vi fant ingen ledige stillinger som matcher søket ditt.</Ingress>
        </div>
    );
}
