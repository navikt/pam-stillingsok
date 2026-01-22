import Image, { StaticImageData } from "next/image";
import { LinkCardAnchor, LinkCardDescription, LinkCardImage, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { LinkCard } from "@navikt/ds-react";

interface ImageLinkPanelSmallProps {
    href: string;
    image: StaticImageData;
    alt: string;
    title: string;
    description: string;
    color?: string;
}

export default function ImageLinkPanelSmall({
    href,
    image,
    alt,
    title,
    description,
    color = "primary-solid",
}: ImageLinkPanelSmallProps) {
    return (
        <LinkCard className={`arb-link-panel-${color}`} size="small">
            <LinkCardImage aspectRatio="4/3">
                <Image quality={90} fill src={image} alt={alt} />
            </LinkCardImage>
            <LinkCardTitle as="h2">
                <LinkCardAnchor href={href}>{title}</LinkCardAnchor>
            </LinkCardTitle>
            <LinkCardDescription>{description}</LinkCardDescription>
        </LinkCard>
    );
}
