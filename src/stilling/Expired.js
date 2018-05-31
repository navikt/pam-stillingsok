import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Link } from 'react-router-dom';
import './Error.less';

export default function Expired() {
    return (
        <AlertStripeInfo className="Error">
            <div className="Error__message">
                <strong>Stillingsannonsen er utløpt.</strong>
                <br />
                <Link className="lenke typo-normal" to="/">Gå til søk</Link>
            </div>
        </AlertStripeInfo>
    );
}
