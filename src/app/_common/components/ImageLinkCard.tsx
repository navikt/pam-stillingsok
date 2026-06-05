"use client";
import { LinkCard } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardImage, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Image, { type StaticImageData } from "next/image";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import { type EventName, track } from "@/app/_common/umami";
import type { TrackArgsFor } from "@/app/_common/umami/events";

// Adapter: LinkCard bruker <div> som klikkbart element, så vi må gjøre tracking-tuple om til en onClick-handler
function adaptTracking(
    tracking: TrackArgsFor<EventName> | undefined,
): React.MouseEventHandler<HTMLDivElement> | undefined {
    if (!tracking) {
        return undefined;
    }

    return () => {
        track(...tracking);
    };
}

interface ImageLinkPanelMediumProps {
    href: string;
    image: StaticImageData;
    alt: string;
    title: string;
    description: string;
    color?: string;
    aspectRatio?: "1/1" | "16/9" | "16/10" | "4/3" | (string & {}) | undefined;
    className?: string;
    tracking?: TrackArgsFor<EventName>;
}

export default function ImageLinkCard({
    href,
    image,
    alt,
    title,
    description,
    color = "primary-solid",
    aspectRatio = "4/3",
    className,
    tracking,
}: ImageLinkPanelMediumProps) {
    return (
        <LinkCard
            className={`arb-link-panel-${color} ${className ?? ""}`}
            size="medium"
            onClick={adaptTracking(tracking)}
        >
            <LinkCardImage aspectRatio={aspectRatio}>
                <Image quality={75} fill src={image} alt={alt} unoptimized />
            </LinkCardImage>
            <LinkCardTitle as="h2">
                <AkselNextLinkCardAnchor href={href}>{title}</AkselNextLinkCardAnchor>
            </LinkCardTitle>
            <LinkCardDescription>{description}</LinkCardDescription>
        </LinkCard>
    );
}
