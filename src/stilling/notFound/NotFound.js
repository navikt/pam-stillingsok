import React from 'react';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './NotFound.less';
import { CONTEXT_PATH } from '../../fasitProperties';

export default function NotFound() {
    return (
        <AlertStripe type="info" className="NotFound alertstripe--solid">
            <h1 className="NotFound__h1">Ikke funnet</h1>
            <p>
                Stillingsannonsen kan være utløpt eller blitt fjernet av arbeidsgiver.
            </p>
            <p>
                <Link to={CONTEXT_PATH} className="typo-normal link link--dark no-print">
                    Gå til ledige stillinger
                </Link>
            </p>
        </AlertStripe>
    );
}
