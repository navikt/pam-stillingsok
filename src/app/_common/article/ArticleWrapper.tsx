import { Heading } from "@navikt/ds-react";
import React from "react";
import { ArticleLanguage } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    title?: string;
    children: React.ReactNode;
    lang?: ArticleLanguage;
    className?: string;
};
export default function ArticleWrapper({ title, children, lang, className = "container-small mt-5 mb-24" }: Props) {
    return (
        <article lang={lang !== "nb" ? lang : undefined} className={className}>
            {title && (
                <Heading level="1" size="xlarge" spacing>
                    {title}
                </Heading>
            )}
            {children}
        </article>
    );
}
