import React from "react";
import { CONTEXT_PATH } from "../../../environment";

function NotFoundMessage() {
    return (
        <React.Fragment>
            <p className="SavedSearches__p" role="alert">
                Det oppsto en feil. Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.
                Forsøk å laste siden på nytt uten det gamle søket.
            </p>
            <a className="Knapp Knapp--hoved" href={CONTEXT_PATH}>
                Last siden på nytt
            </a>
        </React.Fragment>
    );
}

export default NotFoundMessage;
