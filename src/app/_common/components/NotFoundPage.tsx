"use client";

import { NotFound } from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";

interface NotFoundPageProps {
    title?: string;
    text?: string;
}

export default function NotFoundPage({ title, text }: NotFoundPageProps) {
    /** TODO: Vi må rydde opp i typer i arbeidsplassen-react
     * (Konvertere til ts) slik at dette blir fikset og kan fjerne className="" */
    return (
        <PageBlock as="section" width="lg" className="mt-12 mb-24">
            <NotFound title={title} text={text} className="" />
        </PageBlock>
    );
}
