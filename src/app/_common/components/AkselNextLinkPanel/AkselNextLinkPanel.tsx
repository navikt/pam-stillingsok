"use client";

import type { ReactElement, ReactNode } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { LinkPanel, type LinkPanelProps } from "@navikt/ds-react";

/**
 * AkselNextLinkPanel
 *
 * Felles wrapper for Aksel sitt <LinkPanel> + Next.js sitt <Link>.
 *
 * Hvorfor finnes denne:
 * - <LinkPanel> er en Client Component.
 * - Tidligere brukte vi `as={NextLink}` direkte i serverkomponenter.
 *   I React 19 / Next 15 er det ikke lov å sende funksjoner (komponenter)
 *   som props inn i klientkomponenter fra server.
 *
 * Løsning:
 * - Denne komponenten er merket med `use client` og binder
 *   `LinkPanel` + `NextLink` ett sted.
 * - Serverkomponenter kan trygt rendre `<AkselNextLinkPanel href="..." />`.
 *
 * Typing:
 * - NextLink godtar `href: Url` (string | UrlObject).
 * - LinkPanel er typet med `href?: string`.
 * - På runtime støttes begge, men TypeScript klager.
 * - Vi gjør et bevisst, lokalt cast inne i denne komponenten.
 */
export type AkselNextLinkPanelProps = {
    readonly children: ReactNode;
    readonly href: string | undefined;
    readonly prefetch?: NextLinkProps["prefetch"];
} & Omit<LinkPanelProps, "as" | "href">;

export function AkselNextLinkPanel({
    children,
    href,
    prefetch = true,
    ...rest
}: AkselNextLinkPanelProps): ReactElement {
    return (
        <LinkPanel href={href} as={NextLink} prefetch={prefetch} {...rest}>
            {children}
        </LinkPanel>
    );
}
