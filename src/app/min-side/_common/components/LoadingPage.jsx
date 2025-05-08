"use client";

import React from "react";
import { HStack, Loader } from "@navikt/ds-react";

export default function LoadingPage() {
    return (
        <div className="container-large mt-12 mb-12">
            <div className="full-width height-100vh">
                <HStack justify="center" className="mt-8 mb-8" role="status">
                    <Loader size="2xlarge" />
                </HStack>
            </div>
        </div>
    );
}
