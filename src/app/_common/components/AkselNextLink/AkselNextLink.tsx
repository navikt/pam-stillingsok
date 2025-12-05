"use client";

import type { ReactElement, ReactNode } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { Link, type LinkProps } from "@navikt/ds-react";

export type AkselLinkProps = {
    readonly children: ReactNode;
    readonly href: string;
    readonly prefetch?: NextLinkProps["prefetch"];
    /**
     * - "auto" (default): bestemmer ut fra href ("/", "#", http, mailto, osv.)
     * - "internal": tving bruk av NextLink
     * - "external": tving ren <a>
     */
} & Omit<LinkProps, "as" | "href" | "children">;

export function AkselNextLink({ children, href, prefetch = true, ...rest }: AkselLinkProps): ReactElement {
    if (href == null || href === "") {
        if (process.env.NODE_ENV !== "production") {
            console.error("AkselNextLink: href mangler", { children });
        }
        return <span>{children}</span>;
    }

    return (
        <Link as={NextLink} href={href} prefetch={prefetch} {...rest}>
            {children}
        </Link>
    );
}
