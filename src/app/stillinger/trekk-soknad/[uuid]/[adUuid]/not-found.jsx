import React from "react";
import { NotFound as NotFoundComponent } from "@navikt/arbeidsplassen-react";

export default function NotFound() {
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
