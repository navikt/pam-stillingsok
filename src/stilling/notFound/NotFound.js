import React from 'react';
import { Link } from 'react-router-dom';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import './NotFound.less';

export default function NotFound() {
    return (
        <AlertStripeAdvarsel className="NotFound">
            <div className="NotFound__message">
                <p>
                    <strong>Vi fant ikke stillingsannonsen.</strong> Den kan være utløpt eller avpublisert.
                </p>
                <p>
                    <Link to="/" className="typo-normal link no-print">
                        Gå til stillingssøk
                    </Link>
                </p>
            </div>
        </AlertStripeAdvarsel>
    );
}
