"use client";

import React from "react";
import { HStack, Loader } from "@navikt/ds-react";

export default function LoadingPage() {
    return (
        <HStack justify="center" className="mt-8 mb-8" role="status">
            <Loader size="2xlarge" />
        </HStack>
    );
}
