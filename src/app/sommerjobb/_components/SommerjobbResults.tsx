"use client";

import React, { useId } from "react";
import { Heading, HGrid } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";

export interface SommerjobbAd {
    uuid: string;
    title: string;
    description: string;
    employerName: string;
    location: string;
    applicationDueDate: string;
}

interface SommerjobbResultsProps {
    result: SommerjobbAd[];
}

function SommerjobbResults({ result }: SommerjobbResultsProps): JSX.Element {
    const resultsId = useId();
    return (
        <section aria-labelledby={resultsId}>
            <Heading id={resultsId} level="2" size="medium">
                Vi fant xyz ledige sommerjobber
            </Heading>
            <HGrid gap="4" columns={2}>
                {result.map((item) => (
                    <SommerjobbItem key={item.uuid} sommerjobbAd={item} />
                ))}
            </HGrid>
        </section>
    );
}

export default SommerjobbResults;
