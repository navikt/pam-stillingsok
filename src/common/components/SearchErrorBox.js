import {Normaltekst, Undertittel} from "nav-frontend-typografi";
import AlertStripeFeil from "nav-frontend-alertstriper";
import React from "react";
import './SearchErrorBox.less';

const SearchErrorBox = () => {
    return (
        <AlertStripeFeil className="alertstripe--solid feilboks" type={"feil"}>
            <div className="alertstripe__divider"/>
            <Undertittel>
                Det har oppstått en feil
            </Undertittel>
            <Normaltekst>
                På grunn av feil i systemene våre kan du ikke søke etter stillinger nå.
                Vi beklager ulempen dette medfører, og vi jobber med å løse problemet.
                Vennligst prøv igjen senere.
            </Normaltekst>
        </AlertStripeFeil>
    )
}

export default SearchErrorBox;