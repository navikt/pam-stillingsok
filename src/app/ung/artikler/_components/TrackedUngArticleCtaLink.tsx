"use client";

import type { MouseEvent, ReactNode } from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import type { EventPayload } from "@/app/_common/umami";
import { track } from "@/app/_common/umami";

type TrackedUngArticleCtaLinkProps = Readonly<{
    href: string;
    children: ReactNode;
    trackingData: EventPayload<"Klikk - Ung artikkel CTA">;
}>;

export default function TrackedUngArticleCtaLink({ href, children, trackingData }: TrackedUngArticleCtaLinkProps) {
    const handleClick = (_event: MouseEvent<HTMLAnchorElement>): void => {
        track("Klikk - Ung artikkel CTA", trackingData);
    };

    return (
        <AkselNextLinkCardAnchor href={href} onClick={handleClick}>
            {children}
        </AkselNextLinkCardAnchor>
    );
}
