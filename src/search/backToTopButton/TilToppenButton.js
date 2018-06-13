import React from 'react';
import Chevron from 'nav-frontend-chevron';

export default function TilToppenButton() {
    return (
        <a
            href="#topbar"
            className="knapp knapp--standard"
        >
            <Chevron className="BackToTop__chevron" type="opp" />
            <span className="BackToTop__text--mobile">Endre søk</span>
            <span className="BackToTop__text--pc">Til toppen</span>
        </a>
    );
}
