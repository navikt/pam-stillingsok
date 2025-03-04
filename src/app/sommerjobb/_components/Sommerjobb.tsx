"use client";

import React, { useId } from "react";
import { Chips, Heading } from "@navikt/ds-react";

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
                <Chips aria-labelledby={jobbMedId}>
                    <Chips.Toggle>Butikk</Chips.Toggle>
                    <Chips.Toggle>Helse</Chips.Toggle>
                    <Chips.Toggle>Kontor</Chips.Toggle>
                    <Chips.Toggle>Kultur</Chips.Toggle>
                    <Chips.Toggle>Kundeservice</Chips.Toggle>
                    <Chips.Toggle>Lager og industri</Chips.Toggle>
                    <Chips.Toggle>Renhold</Chips.Toggle>
                    <Chips.Toggle>Restaurant og cafe</Chips.Toggle>
                    <Chips.Toggle>Transport</Chips.Toggle>
                    <Chips.Toggle>Turisme</Chips.Toggle>
                    <Chips.Toggle>Utendørs</Chips.Toggle>
                </Chips>
            </section>
            <section></section>
        </div>
    );
}

export default Sommerjobb;
