import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Error.less';

export default function Expired() {
    return (
        <AlertStripeInfo className="Error">
            <div className="Error__message">
                <strong>Stillingsannonsen er utløpt.</strong>
            </div>
        </AlertStripeInfo>
    );
}
