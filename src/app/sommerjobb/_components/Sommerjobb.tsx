"use client";

import React, { useId } from "react";
import { Heading } from "@navikt/ds-react";

function Sommerjobb(): JSX.Element {
    const jobbMedId = useId();
    return (
        <div>
            <section className="container-medium mt-10 mb-24">
                <Heading level="1" size="large">
                    Sommerjobben 2025
                </Heading>
            </section>
            <section aria-label="Ditt søk">
                <Heading id={jobbMedId} level="2" size="small">
                    Jeg vil jobbe med...
                </Heading>
                {/* <Chips aria-labelledby={jobbMedId}>
                    <ChipsToggle>Butikk</ChipsToggle>
                </Chips> */}
            </section>
            <section></section>
        </div>
    );
}

export default Sommerjobb;
