"use client";

import React, { useId } from "react";
import { Button, Heading, HGrid, HStack, VStack } from "@navikt/ds-react";
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
            <HStack justify="center" className="mb-4">
                <Heading id={resultsId} level="2" size="large" spacing>
                    Vi fant 21 ledige sommerjobber!
                </Heading>
            </HStack>
            <HGrid gap="4" columns={2}>
                {result.map((item) => (
                    <SommerjobbItem key={item.uuid} sommerjobbAd={item} />
                ))}
            </HGrid>
            <VStack align="center" className="mt-10">
                <Button>Last inn flere</Button>
            </VStack>
        </section>
    );
}

export default SommerjobbResults;
