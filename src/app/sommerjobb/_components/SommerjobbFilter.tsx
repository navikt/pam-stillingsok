"use client";

import React, { ReactElement, useCallback, useId } from "react";
import { Chips, Heading, HGrid, Select, UNSAFE_Combobox as Combobox, VStack } from "@navikt/ds-react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SommerjobbFilterProps {
    postcodes: Postcode[];
}

const JOBBE_MED_PARAM_NAME = "jobbeMed";

function SommerjobbFilter({ postcodes }: SommerjobbFilterProps): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const jobbMedId = useId();

    const appendQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!params.has(name, value)) {
                params.append(name, value);
            }
            router.push(pathname + "?" + params.toString());
        },
        [searchParams, pathname, router],
    );

    const removeQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name, value);
            router.push(pathname + "?" + params.toString());
        },
        [searchParams, pathname, router],
    );

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
                    {[
                        "Butikk",
                        "Helse",
                        "Kontor",
                        "Kultur",
                        "Kundeservice",
                        "Lager og industri",
                        "Renhold",
                        "Restaurant og kafé",
                        "Transport",
                        "Turisme",
                        "Utendørs",
                    ].map((item) => (
                        <Chips.Toggle
                            key={item}
                            selected={searchParams.has(JOBBE_MED_PARAM_NAME, item)}
                            checkmark={true}
                            onClick={() => {
                                searchParams.has(JOBBE_MED_PARAM_NAME, item)
                                    ? removeQueryParam(JOBBE_MED_PARAM_NAME, item)
                                    : appendQueryParam(JOBBE_MED_PARAM_NAME, item);
                            }}
                        >
                            {item}
                        </Chips.Toggle>
                    ))}
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
