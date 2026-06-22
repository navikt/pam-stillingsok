"use client";
import { LinkCard } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardImage, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Image, { type StaticImageData } from "next/image";
import type { MouseEventHandler } from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import { type EventName, type EventPayload, track } from "@/app/_common/umami";

interface ImageLinkPanelMediumProps<Name extends EventName = EventName> {
    href: string;
    image: StaticImageData;
    alt: string;
    title: string;
    description: string;
    color?: string;
    aspectRatio?: "1/1" | "16/9" | "16/10" | "4/3" | (string & {}) | undefined;
    className?: string;
    trackingData?: {
        name: Name;
        data: EventPayload<Name>;
    };
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function ImageLinkCard<Name extends EventName = EventName>({
    href,
    image,
    alt,
    title,
    description,
    color = "primary-solid",
    aspectRatio = "4/3",
    className,
    trackingData,
    onClick,
}: ImageLinkPanelMediumProps<Name>) {
    const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
        if (trackingData) {
            track(trackingData.name, trackingData.data);
        }
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <LinkCard className={`arb-link-panel-${color} ${className ?? ""}`} size="medium" onClick={handleClick}>
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
