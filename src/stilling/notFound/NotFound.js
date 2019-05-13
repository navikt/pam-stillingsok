import React from 'react';
import { Link } from 'react-router-dom';
import AlertStripe from 'nav-frontend-alertstriper';
import './NotFound.less';
import { CONTEXT_PATH } from '../../fasitProperties';

export default function NotFound() {
    return (
        <AlertStripe type="advarsel" className="NotFound">
            <strong>Vi fant ikke stillingsannonsen.</strong> Den kan være utløpt eller avpublisert.
            <br />
            <Link to={CONTEXT_PATH} className="typo-normal link link--dark no-print">
                Gå til ledige stillinger
            </Link>
        </AlertStripe>
    );
}
