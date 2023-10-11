import { BodyLong, Heading } from "@navikt/ds-react";

export default function Error() {
    return (
        <div className="container-large mt-12 mb-12">
            <section className="ErrorMessage" role="alert">
                <Heading level="2" size="medium" className="mb-4 mt-4">
                    Det oppsto en feil
                </Heading>
                <BodyLong className="ErrorMessage__text">Forsøk å laste inn siden på nytt</BodyLong>
            </section>
        </div>
    );
}
