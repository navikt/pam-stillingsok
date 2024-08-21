import React from "react";
import NotFoundPage from "@/app/_common/components/NotFoundPage";

export default function CustomNotFoundPage() {
    return (
        <NotFoundPage
            title="Vi fant dessverre ikke stillingsannonsen"
            text="Annonsen kan være utløpt eller blitt fjernet av arbeidsgiver."
        />
    );
}
