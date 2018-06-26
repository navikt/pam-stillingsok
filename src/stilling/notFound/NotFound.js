import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import './NotFound.less';

export default function NotFound() {
    return (
        <AlertStripeInfo className="NotFound">
            <div className="NotFound__message">
                <strong>Vi fant ikke stillingsannonsen.</strong> Den kan være utløpt eller avpublisert.
            </div>
        </AlertStripeInfo>
    );
}
