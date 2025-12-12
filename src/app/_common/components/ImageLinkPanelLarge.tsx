"use client";
import { LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import Image, { StaticImageData } from "next/image";
import { AkselNextLinkPanel } from "@/app/_common/components/AkselNextLinkPanel/AkselNextLinkPanel";

interface ImageLinkPanelLargeProps {
    href: string;
    image: StaticImageData;
    alt: string;
    title: string;
    description: string;
    color?: string;
}

export default function ImageLinkPanelLarge({
    href,
    image,
    alt,
    title,
    description,
    color = "primary-solid",
}: ImageLinkPanelLargeProps) {
    return (
        <article className="image-link-panel-large">
            <div className="image-link-panel-img-large">
                <Image fill quality={90} src={image} alt={alt} />
            </div>
            <AkselNextLinkPanel className={`arb-link-panel-${color} image-link-panel-link`} href={href}>
                <LinkPanelTitle
                    as="h2"
                    className="navds-link-panel__title navds-heading--small image-link-panel-content"
                >
                    {title}
                </LinkPanelTitle>
                <LinkPanelDescription className="navds-link-panel__description navds-body-long image-link-panel-content">
                    {description}
                </LinkPanelDescription>
            </AkselNextLinkPanel>
        </article>
    );
}
