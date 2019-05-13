import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import './Expired.less';

export default function Expired() {
    return (
        <AlertStripe type="advarsel" className="Expired">
            Stillingsannonsen er inaktiv.
        </AlertStripe>
    );
}
