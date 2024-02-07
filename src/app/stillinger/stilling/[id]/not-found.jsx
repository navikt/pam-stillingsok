import React from "react";
import { NotFound as NotFoundComponent } from "@navikt/arbeidsplassen-react";

export default function NotFound() {
    return (
        <div className="container-large mt-12 mb-12">
            <NotFoundComponent
                title="Vi fant dessverre ikke stillingsannonsen"
                text="Annonsen kan være utløpt eller blitt fjernet av arbeidsgiver."
            />
        </div>
    );
}
