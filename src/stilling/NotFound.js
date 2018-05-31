import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Link } from 'react-router-dom';
import './Error.less';

export default function NotFound() {
    return (
        <AlertStripeInfo className="Error">
            <div className="Error__message">
                <strong>Vi fant ikke stillingsannonsen.</strong> Den kan være utløpt eller avpublisert.
                <br />
                <Link className="lenke typo-normal" to="/">Gå til søk</Link>
            </div>
        </AlertStripeInfo>
    );
}
