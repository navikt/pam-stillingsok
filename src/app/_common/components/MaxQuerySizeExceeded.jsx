"use client";

import React from "react";
import { NotFound } from "@navikt/arbeidsplassen-react";

export default function MaxQuerySizeExceeded() {
    return (
        <div className="container-large mt-12 mb-12">
            <NotFound
                title="Du har nådd maks antall annonser for ditt søk"
                text="Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser."
            />
        </div>
    );
}
