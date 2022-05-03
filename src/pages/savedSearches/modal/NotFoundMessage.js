import React from "react";
import { CONTEXT_PATH } from "../../../environment";

function NotFoundMessage() {
    return (
        <React.Fragment>
            <p className="SavedSearches__p" role="alert">
                Det oppsto en feil. Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.
            </p>
            <a className="link" href={CONTEXT_PATH}>
                Forsøk å laste siden på nytt uten det gamle søket.
            </a>
        </React.Fragment>
    );
}

export default NotFoundMessage;
