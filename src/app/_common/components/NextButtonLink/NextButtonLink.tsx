"use client";

import { Button } from "@navikt/ds-react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { type EventName, track } from "@/app/_common/umami";
import type { TrackArgsFor } from "@/app/_common/umami/events";

type NextButtonLinkProps<Name extends EventName = EventName> = {
    readonly href: string;
    readonly children: ReactNode;
    readonly variant?: "primary" | "secondary" | "tertiary";
    readonly size?: "medium" | "small" | "xsmall";
    readonly replace?: boolean;
    readonly scroll?: boolean;
    readonly className?: string;
    readonly tracking?: TrackArgsFor<Name>;
};

export function NextButtonLink<Name extends EventName = EventName>({
    href,
    children,
    variant = "primary",
    size = "medium",
    replace = false,
    scroll = true,
    className,
    tracking,
}: NextButtonLinkProps<Name>) {
    const handleClick = () => {
        if (tracking) {
            // TypeScript kan ikke resolve generisk tuple-spread mot track-overloadene.
            (track as (...args: TrackArgsFor<Name>) => void)(...tracking);
        }
    };

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
            onClick={handleClick}
        >
            {children}
        </Button>
    );
}
