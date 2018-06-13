import React from 'react';
import Chevron from 'nav-frontend-chevron';

export default function TilToppenButton() {
    return (
        <a
            href="#top"
            className="TilToppenButton"
        >
            <span className="TilToppenButton__inner">
                <Chevron className="TilToppenButton__chevron" type="opp" />
                <span className="TilToppenButton__text--mobile typo-normal">Endre søk</span>
                <span className="TilToppenButton__text--pc typo-normal">Til toppen</span>
            </span>
        </a>
    );
}
