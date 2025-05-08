"use client";

import React from "react";
import { NotFound as NotFoundComponent } from "@navikt/arbeidsplassen-react";

export default function NotFoundPage() {
    return (
        <div className="container-large mt-12 mb-12">
            <NotFoundComponent />
        </div>
    );
}
