import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";

function TrekkSoknadSuccess() {
    return (
        <React.Fragment>
            <h1 className="InterestForm__h1" aria-live="polite" role="alert">
                Din søknad er nå trukket
            </h1>
            <p className="InterestForm__p InterestForm__mb-2">
                Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk søknaden, kan du søke
                på nytt.
            </p>
            <Link to={CONTEXT_PATH} className="Knapp">
                Se ledige stillinger
            </Link>
        </React.Fragment>
    );
}

export default TrekkSoknadSuccess;
