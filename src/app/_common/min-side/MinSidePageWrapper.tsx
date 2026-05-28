import { Heading, type PageBlockProps } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type React from "react";
import { cn } from "@/app/_common/utils/cn";

type Props = {
    title?: string;
    children: React.ReactNode;
    className?: string;
    width?: PageBlockProps["width"];
};
export default function MinSidePageWrapper({ title, children, className, width = "lg" }: Props) {
    return (
        <PageBlock as="section" gutters width={width} className={cn("mb-12 mt-5", className)}>
            {title && (
                <Heading level="1" size="xlarge" className="mb-8" align="center">
                    {title}
                </Heading>
            )}
            {children}
        </PageBlock>
    );
}
