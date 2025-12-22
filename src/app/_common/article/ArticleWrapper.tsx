import { Heading, PageBlockProps } from "@navikt/ds-react";
import React from "react";
import { ArticleLanguage } from "@/app/(static)/(artikler)/pageInfoTypes";
import { PageBlock } from "@navikt/ds-react/Page";
import { cn } from "@/app/_common/utils/cn";

type Props = {
    title?: string;
    children: React.ReactNode;
    lang?: ArticleLanguage;
    className?: string;
    width?: PageBlockProps["width"];
};
export default function ArticleWrapper({ title, children, lang, className, width = "text" }: Props) {
    return (
        <PageBlock
            lang={lang !== "nb" ? lang : undefined}
            as="article"
            gutters
            width={width}
            className={cn("mb-12 mt-5", className)}
        >
            {title && (
                <Heading level="1" size="xlarge" spacing>
                    {title}
                </Heading>
            )}
            {children}
        </PageBlock>
    );
}
