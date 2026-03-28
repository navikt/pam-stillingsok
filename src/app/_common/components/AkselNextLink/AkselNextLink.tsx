"use client";

import type { MouseEventHandler, ReactNode } from "react";
import NextLink from "next/link";
import { Link, type LinkProps } from "@navikt/ds-react";
import { EventName, track } from "@/app/_common/umami";
import { TrackArgsFor } from "@/app/_common/umami/events";

export type AkselLinkProps<Name extends EventName = EventName> = {
    readonly children: ReactNode;
    readonly href: string;
    tracking?: TrackArgsFor<Name>;
    /**
     * - "auto" (default): bestemmer ut fra href ("/", "#", http, mailto, osv.)
     * - "internal": tving bruk av NextLink
     * - "external": tving ren <a>
     */
} & Omit<LinkProps, "as" | "href" | "children">;

export function AkselNextLink(props: AkselLinkProps) {
    const { children, tracking, href, ...rest } = props;
    if (href == null || href === "") {
        if (process.env.NODE_ENV !== "production") {
            console.error("AkselNextLink: href mangler", { children });
        }
        return <span>{children}</span>;
    }

    const handleClick: MouseEventHandler<HTMLAnchorElement> = () => {
        if (tracking) {
            track(...tracking);
        }
    };

    return (
        <Link as={NextLink} href={href} {...rest} prefetch={false} onClick={handleClick}>
            {children}
        </Link>
    );
}
