import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Link } from 'react-router-dom';
import './NoFavourites.less';

export default function NoFavourites() {
    return (
        <div className="NoFavourites">
            <Undertittel className="NoFavourites__title">Du har ingen favoritter</Undertittel>
            <Normaltekst className="NoFavourites__message">
                Når du ser en stillingsannonse du ønsker å ta vare på klikk på stjernen.
            </Normaltekst>
            <Link to="/" className="lenke typo-normal">Finn favoritter</Link>
        </div>
    );
}

