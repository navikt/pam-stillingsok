"use client";

import React, { ReactElement } from "react";

import GlobalError from "@/app/global-error";

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }): ReactElement {
    console.log("dfadsf", error);
    return <GlobalError error={error} />;
}
