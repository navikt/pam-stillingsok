"use client";
import { LinkCard } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardImage, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Image, { type StaticImageData } from "next/image";
import type { MouseEventHandler } from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import { type EventName, track } from "@/app/_common/umami";
import type { TrackArgsFor } from "@/app/_common/umami/events";

interface ImageLinkPanelMediumProps<Name extends EventName = EventName> {
    href: string;
    image: StaticImageData;
    alt: string;
    title: string;
    description: string;
    color?: string;
    aspectRatio?: "1/1" | "16/9" | "16/10" | "4/3" | (string & {}) | undefined;
    className?: string;
    tracking?: TrackArgsFor<Name>;
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
    tracking,
    onClick,
}: ImageLinkPanelMediumProps<Name>) {
    const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
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
