import {useState} from "react";
import * as React from 'react';
import { Knapp } from 'pam-frontend-knapper';
import {Link} from "react-router-dom";

const TopMenuVilkarBanner = () => {
    const [showBanner, setShowBanner] =
        useState(localStorage.getItem('topMenuVilkarBanner') == null);

    const onClose = () => {
        setShowBanner(false);
        localStorage.setItem('topMenuVilkarBanner', 'true');
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="TopMenuVilkarBanner">
            <div className="TopMenuVilkarBanner__content">
                <div className="TopMenuVilkarBanner__content--container">
                    <p>Vi har oppdatert vilkårene for å bruke tjenestene.&nbsp;
                        <Link to="/personinnstillinger" className="lenke typo-element">
                            Gå til innstillinger
                        </Link>
                        &nbsp;for å lese mer.
                    </p>
                    <Knapp mini={true} onClick={onClose}>Lukk</Knapp>
                </div>
            </div>
        </div>
    )
};

export default TopMenuVilkarBanner;
