"use client";

import React, { useRef } from "react";
import { Loader } from "@navikt/ds-react";
import { useSkyraInlineLoading } from "@/app/_common/skyra/useSkyraInlineLoading";

type Props = Readonly<{
    readonly slug: string;
    readonly lang?: string;
}>;

export function SkyraSurveyEmbed({ slug, lang }: Props) {
    const skyraSurveyRef = useRef<HTMLElement | null>(null);

    const { isLoading } = useSkyraInlineLoading({ skyraSurveyRef, slug });

    return (
        <div>
            {isLoading && (
                <div role="status" aria-live="polite" aria-label="Laster undersøkelsen">
                    <Loader title="Laster undersøkelsen" />
                </div>
            )}

            <skyra-survey ref={skyraSurveyRef} slug={slug} lang={lang} inline></skyra-survey>
        </div>
    );
}
