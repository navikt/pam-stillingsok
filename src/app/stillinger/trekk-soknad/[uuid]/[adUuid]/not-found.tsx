import React, { ReactElement } from "react";
import NotFoundPage from "@/app/stillinger/_common/components/NotFoundPage";

export default function CustomNotFoundPage(): ReactElement {
    return (
        <NotFoundPage
            title="Vi fant dessverre ikke din søknad"
            text="Det kan være at du allerede har trukket søknaden din eller at bedriften har avslått søknaden
                        din."
        />
    );
}
