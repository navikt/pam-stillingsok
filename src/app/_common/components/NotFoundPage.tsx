"use client";

import React, { ReactElement } from "react";
import { NotFound } from "@navikt/arbeidsplassen-react";

interface NotFoundPageProps {
    title?: string;
    text?: string;
}

export default function NotFoundPage({ title, text }: NotFoundPageProps): ReactElement {
    return (
        <div className="container-large mt-12 mb-24">
            <NotFound title={title} text={text} />
        </div>
    );
}
