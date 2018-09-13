import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './NoFavorites.less';

export default function NoFavorites() {
    return (
        <div className="NoFavorites">
            <Undertittel>Du har ingen favoritter</Undertittel>
            <Normaltekst>Du kan lagre en annonse ved å trykke på <span className="FavoriteButton__star">&#9734;</span></Normaltekst>
        </div>
    );
}

