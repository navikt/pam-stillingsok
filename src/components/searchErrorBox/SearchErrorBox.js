import { Normaltekst, Undertittel } from "nav-frontend-typografi";
import AlertStripeFeil from "nav-frontend-alertstriper";
import React from "react";
import "./SearchErrorBox.less";

const SearchErrorBox = () => {
    return (
        <AlertStripeFeil className="alertstripe--solid feilboks" type={"feil"}>
            <div className="alertstripe__divider" />
            <Undertittel>Du kan dessverre ikke søke etter stillinger nå</Undertittel>
            <br />
            <Normaltekst>
                På grunn av en feil i våre systemer er ikke stillingssøket tilgjengelig. Vi jobber raskt med å løse
                problemet og beklager ulempen dette vil medføre. Vennligst prøv igjen senere.
            </Normaltekst>
        </AlertStripeFeil>
    );
};

export default SearchErrorBox;
