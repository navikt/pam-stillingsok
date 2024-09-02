"use client";

import React, { ReactElement } from "react";
// @ts-expect-error TODO: Add typeinfo for arbeidsplassen-react
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
