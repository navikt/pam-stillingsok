import React from "react";
import { NotFound as NotFoundComponent } from "@navikt/arbeidsplassen-react";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";

export default function NotFound() {
    useDocumentTitle("Ikke funnet");

    return (
        <div className="container-large mt-12 mb-12">
            <NotFoundComponent
                title="Vi fant dessverre ikke din søknad"
                text="Det kan være at du allerede har trukket søknaden din eller at bedriften har avslått søknaden
                        din."
            />
        </div>
    );
}
