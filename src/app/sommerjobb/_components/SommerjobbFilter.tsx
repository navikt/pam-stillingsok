"use client";

import React, { ReactElement, useId } from "react";
import { Chips, Heading, HGrid, Select, UNSAFE_Combobox as Combobox, VStack } from "@navikt/ds-react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";

interface SommerjobbFilterProps {
    postcodes: Postcode[];
}

function SommerjobbFilter({ postcodes }: SommerjobbFilterProps): ReactElement {
    const jobbMedId = useId();

    const allPostcodeOptions = postcodes.map((data) => ({
        value: data.postcode,
        label: `${data.postcode} ${data.city}`,
    }));

    return (
        <section aria-label="Ditt søk">
            <VStack align="center" className="mb-8">
                <Heading id={jobbMedId} level="2" size="small" spacing>
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
            </VStack>
            <HGrid gap="4" columns={{ xs: 1, sm: 1, md: 2 }}>
                <Combobox label="Velg sted eller postnummer" options={allPostcodeOptions}></Combobox>
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
