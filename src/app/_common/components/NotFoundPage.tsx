"use client";

import React, { ReactElement } from "react";
import { NotFound } from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";

interface NotFoundPageProps {
    title?: string;
    text?: string;
}

export default function NotFoundPage({ title, text }: NotFoundPageProps): ReactElement {
    return (
        <PageBlock as="section" width="lg" className="mt-12 mb-24">
            <NotFound title={title} text={text} />
        </PageBlock>
    );
}
