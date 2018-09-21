import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './NoFavourites.less';

export default function NoFavourites() {
    return (
        <div className="NoFavourites">
            <Undertittel>Du har ingen favoritter</Undertittel>
            <Normaltekst>
                Du kan lagre en annonse ved å trykke på <span className="FavouriteButton__star">&#9734;</span>
            </Normaltekst>
        </div>
    );
}

