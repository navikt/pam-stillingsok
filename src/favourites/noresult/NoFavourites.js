import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Link } from 'react-router-dom';
import './NoFavourites.less';
import { CONTEXT_PATH } from '../../fasitProperties';

export default function NoFavourites() {
    return (
        <div className="NoFavourites">
            <Undertittel className="NoFavourites__title">Du har ingen favoritter</Undertittel>
            <Normaltekst className="NoFavourites__message">
                Klikk på stjernen når du ser en stilling du ønsker å ta vare på.
            </Normaltekst>
            <Link to={CONTEXT_PATH} className="link">Finn favoritter</Link>
        </div>
    );
}

