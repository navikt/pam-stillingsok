import React from "react";
import "./SuperraskSoknadBanner.css";
import { BodyLong, Heading, Link as AkselLik } from "@navikt/ds-react";

function SuperraskSoknadBanner() {
    return (
        <section className="SuperraskSoknadBanner">
            <Heading level="3" size="medium" spacing>
                Nyhet! Superrask søknad
            </Heading>
            <BodyLong spacing>
                Vis frem deg selv og din erfaring enkelt og raskt når du søker på stillinger med superrask søknad.
            </BodyLong>
            <BodyLong>
                <AkselLik href="/slik-fungerer-superrask-soknad">Hvordan fungerer superrask søknad?</AkselLik>
            </BodyLong>
        </section>
    );
}

export default SuperraskSoknadBanner;
