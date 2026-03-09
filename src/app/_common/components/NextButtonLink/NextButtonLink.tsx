"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { Button } from "@navikt/ds-react";

type NextButtonLinkProps = {
    readonly href: string;
    readonly children: ReactNode;
    readonly variant?: "primary" | "secondary" | "tertiary";
    readonly size?: "medium" | "small" | "xsmall";
    readonly replace?: boolean;
    readonly scroll?: boolean;
    readonly className?: string;
};

export function NextButtonLink({
    href,
    children,
    variant = "primary",
    size = "medium",
    replace = false,
    scroll = true,
    className,
}: NextButtonLinkProps) {
    return (
        <Button
            as={NextLink}
            href={href}
            variant={variant}
            size={size}
            prefetch={false}
            replace={replace}
            scroll={scroll}
            className={className}
        >
            {children}
        </Button>
    );
}
