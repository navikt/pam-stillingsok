import React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import './Expired.less';

export default function Expired() {
    return (
        <AlertStripeAdvarsel className="Expired">
            <div className="Expired__message">
                <strong>Stillingsannonsen er inaktiv.</strong>
            </div>
        </AlertStripeAdvarsel>
    );
}
