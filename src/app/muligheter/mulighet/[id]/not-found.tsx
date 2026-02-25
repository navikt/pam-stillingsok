import React, { ReactElement } from "react";
import NotFoundPage from "@/app/_common/components/NotFoundPage";

export default function CustomNotFoundPage(): ReactElement {
    return (
        <NotFoundPage
            title="Vi fant dessverre ikke jobbmuligheten"
            text="Annonsen kan være utløpt eller blitt fjernet."
        />
    );
}
