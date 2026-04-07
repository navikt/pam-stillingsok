"use client";

import type { MouseEventHandler, ReactNode } from "react";
import NextLink from "next/link";
import { Link, type LinkProps } from "@navikt/ds-react";
import { type EventName, track } from "@/app/_common/umami";
import { type TrackArgsFor } from "@/app/_common/umami/events";

export type AkselLinkProps<Name extends EventName = EventName> = {
    readonly children: ReactNode;
    readonly href: string;
    tracking?: TrackArgsFor<Name>;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    /**
     * - "auto" (default): bestemmer ut fra href ("/", "#", http, mailto, osv.)
     * - "internal": tving bruk av NextLink
     * - "external": tving ren <a>
     */
} & Omit<LinkProps, "as" | "href" | "children">;

export const AkselNextLink = <Name extends EventName = EventName>(props: AkselLinkProps<Name>) => {
    const { children, tracking, href, onClick, ...rest } = props;
    if (href == null || href === "") {
        if (process.env.NODE_ENV !== "production") {
            console.error("AkselNextLink: href mangler", { children });
        }
        return <span>{children}</span>;
    }

    const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        if (tracking) {
            // TrackArgsFor<Name> er alltid en gyldig track()-signatur, men TS
            // klarer ikke å resolve generisk tuple-spread mot overloads.
            (track as (...args: TrackArgsFor<Name>) => void)(...tracking);
        }
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <Link as={NextLink} href={href} {...rest} prefetch={false} onClick={handleClick}>
            {children}
        </Link>
    );
};
