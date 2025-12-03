"use client";

import type { ReactElement, ReactNode } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { Link, type LinkProps as AkselLinkProps } from "@navikt/ds-react";

/**
 * AkselNextLink
 *
 * Felles lenkekomponent for interne lenker i appen.
 *
 * Hvorfor wrapper?
 * - Aksel sitt <Link>-komponent er en Client Component.
 * - Next.js sitt <Link>-komponent er også en Client Component.
 * - I React 19 / Next 15 kan vi ikke sende komponent-funksjoner
 *   som props fra Server Components (f.eks. `as={NextLink}`).
 *
 * Løsning:
 * - Denne komponenten er `use client` og binder AkselLink + NextLink ett sted.
 * - Serverkomponenter kan trygt rendre `<AkselNextLink href="...">`
 *   uten å bryte reglene for Server/Client-komponenter.
 */
export type AkselNextLinkProps = {
    readonly children: ReactNode;
    readonly href: string | undefined;
    readonly prefetch?: NextLinkProps["prefetch"];
} & Omit<AkselLinkProps, "as" | "href">;

export function AkselNextLink({ children, href, prefetch = true, ...rest }: AkselNextLinkProps): ReactElement {
    return (
        <Link as={NextLink} href={href} prefetch={prefetch} {...rest}>
            {children}
        </Link>
    );
}
