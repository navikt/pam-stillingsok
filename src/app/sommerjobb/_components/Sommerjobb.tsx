"use client";

import React from "react";
import { Heading, VStack } from "@navikt/ds-react";
import SommerjobbFilter from "@/app/sommerjobb/_components/SommerjobbFilter";
import SommerjobbResults from "@/app/sommerjobb/_components/SommerjobbResults";
import GreenFlower from "@/app/_common/icons/GreenFlower";
import RedFlower from "@/app/_common/icons/RedFlower";

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
    return (
        <VStack gap="10" className="mb-24">
            <div className="container-medium">
                <GreenFlower />
                <Heading level="1" size="large" className="mt-10 mb-24">
                    Sommerjobben 2025
                </Heading>
                <RedFlower />
                <SommerjobbFilter />
            </div>
            <div className="container-medium">
                <SommerjobbResults result={result} />
            </div>
        </VStack>
    );
}

export default Sommerjobb;
