"use client";

import React, { useId } from "react";
import { Chips, Heading, HGrid, Select, UNSAFE_Combobox as Combobox } from "@navikt/ds-react";

function SommerjobbFilter(): JSX.Element {
    const jobbMedId = useId();
    return (
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
                <Chips.Toggle>Restaurant og kafé</Chips.Toggle>
                <Chips.Toggle>Transport</Chips.Toggle>
                <Chips.Toggle>Turisme</Chips.Toggle>
                <Chips.Toggle>Utendørs</Chips.Toggle>
            </Chips>
            <HGrid gap="4" columns={{ xs: 1, sm: 1, md: 2 }}>
                <Combobox label="hei" options={["1", "2"]}></Combobox>
                <Select size="medium" onChange={() => {}} value={""} label="Velg maks reiseavstand">
                    <option key="0" value="">
                        Velg avstand
                    </option>
                    {[1, 3, 5, 7, 10, 20, 30, 50, 75, 100, 150].map((km) => (
                        <option key={km} value={km}>
                            {km} kilometer
                        </option>
                    ))}
                </Select>
            </HGrid>
        </section>
    );
}

export default SommerjobbFilter;
