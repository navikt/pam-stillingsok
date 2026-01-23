"use client";
import Image, { StaticImageData } from "next/image";
import { LinkCardDescription, LinkCardImage, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { LinkCard } from "@navikt/ds-react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
interface ImageLinkPanelMediumProps {
    href: string;
    image: StaticImageData;
    alt: string;
    title: string;
    description: string;
    color?: string;
    aspectRatio?: "1/1" | "16/9" | "16/10" | "4/3" | (string & {}) | undefined;
}

export default function ImageLinkCard({
    href,
    image,
    alt,
    title,
    description,
    color = "primary-solid",
    aspectRatio = "4/3",
}: ImageLinkPanelMediumProps) {
    return (
        <LinkCard className={`arb-link-panel-${color}`} size="medium">
            <LinkCardImage aspectRatio={aspectRatio}>
                <Image quality={90} fill src={image} alt={alt} />
            </LinkCardImage>
            <LinkCardTitle as="h2">
                <AkselNextLinkCardAnchor href={href}>{title}</AkselNextLinkCardAnchor>
            </LinkCardTitle>
            <LinkCardDescription>{description}</LinkCardDescription>
        </LinkCard>
    );
}
