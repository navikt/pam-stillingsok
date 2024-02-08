import React from "react";
import NotFoundPage from "../../../_common/components/NotFoundPage";

export default function CustomNotFoundPage() {
    return (
        <NotFoundPage
            title="Vi fant dessverre ikke din søknad"
            text="Det kan være at du allerede har trukket søknaden din eller at bedriften har avslått søknaden
                        din."
        />
    );
}
