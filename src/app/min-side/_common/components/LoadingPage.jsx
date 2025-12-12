"use client";

import React from "react";
import { HStack, Loader } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
/** TODO: konverter til ts*/
export default function LoadingPage() {
    return (
        <PageBlock width="lg" gutters className="mt-12 mb-12">
            <div className="full-width height-100vh">
                <HStack justify="center" className="mt-8 mb-8" role="status">
                    <Loader size="2xlarge" />
                </HStack>
            </div>
        </PageBlock>
    );
}
