import React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import useDocumentTitle from "./common/hooks/useDocumentTitle";

export default function Error() {
    useDocumentTitle("Feil");

    return (
        <div className="container-large mt-12 mb-12">
            <section className="text-center" role="alert">
                <Heading level="1" size="medium" className="mb-4 mt-4">
                    Det oppsto en feil
                </Heading>
                <BodyLong>Forsøk å laste inn siden på nytt</BodyLong>
            </section>
        </div>
    );
}
