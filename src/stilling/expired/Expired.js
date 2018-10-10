import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Expired.less';

export default function Expired() {
    return (
        <AlertStripeInfo className="Expired">
            <div className="Expired__message">
                <strong>Stillingsannonsen er inaktiv.</strong>
            </div>
        </AlertStripeInfo>
    );
}
