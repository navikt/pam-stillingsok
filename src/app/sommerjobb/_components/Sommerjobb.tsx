"use client";

import React, { useId } from "react";
import { Chips, Heading, HGrid, Select, UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";

export interface SommerjobbAd {
    uuid: string;
    title: string;
    description: string;
    employerName: string;
    location: string;
    applicationDueDate: string;
}

interface SommerjobbProps {
    result: SommerjobbAd[];
}

function Sommerjobb({ result }: SommerjobbProps): JSX.Element {
    const jobbMedId = useId();
    const resultsId = useId();
    return (
        <div>
            <section className="container-medium mt-10 mb-24">
                <Heading level="1" size="large">
                    Sommerjobben 2025
                </Heading>
            </section>
            <section aria-label="Ditt søk" className="container-medium ">
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
            <section aria-labelledby={resultsId} className="container-medium ">
                <Heading id={resultsId} level="2" size="medium">
                    Vi fant xyz ledige sommerjobber
                </Heading>
                <HGrid gap="4" columns={2}>
                    {result.map((item) => (
                        <SommerjobbItem key={item.uuid} sommerjobbAd={item} />
                    ))}
                </HGrid>
            </section>
        </div>
    );
}

export default Sommerjobb;
