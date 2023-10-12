import React from "react";
import { NotFound as NotFoundComponent } from "@navikt/arbeidsplassen-react";
import useDocumentTitle from "../common/hooks/useDocumentTitle";

export default function NotFound() {
    useDocumentTitle("Ikke funnet");

    return (
        <div className="container-large mt-12 mb-12">
            <NotFoundComponent
                title="Vi fant dessverre ikke stillingsannonsen"
                text="Annonsen kan være utløpt eller blitt fjernet av arbeidsgiver."
            />
        </div>
    );
}