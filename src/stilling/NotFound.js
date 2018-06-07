import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Error.less';

export default function NotFound() {
    return (
        <AlertStripeInfo className="Error">
            <div className="Error__message">
                <strong>Vi fant ikke stillingsannonsen.</strong> Den kan være utløpt eller avpublisert.
            </div>
        </AlertStripeInfo>
    );
}
