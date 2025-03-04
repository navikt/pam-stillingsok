"use client";

import React from "react";
import { Heading } from "@navikt/ds-react";
import SommerjobbFilter from "@/app/sommerjobb/_components/SommerjobbFilter";
import SommerjobbResults from "@/app/sommerjobb/_components/SommerjobbResults";

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
        <div>
            <div className="container-medium">
                <Heading level="1" size="large" className="mt-10 mb-24">
                    Sommerjobben 2025
                </Heading>
                <SommerjobbFilter />
            </div>
            <div className="container-medium">
                <SommerjobbResults result={result} />
            </div>
        </div>
    );
}

export default Sommerjobb;
