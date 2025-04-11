import { LinkPanel } from "@navikt/ds-react";
import NextLink from "next/link";

interface ImageLinkPanelLargeProps {
    href: string;
    image: string;
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
        <div className="image-link-panel-large">
            <div className="image-link-panel-img-large">
                <img src={image} alt={alt} />
            </div>
            <LinkPanel as={NextLink} className={`arb-link-panel-${color} image-link-panel-link`} href={href}>
                <LinkPanel.Title className="navds-link-panel__title navds-heading--small image-link-panel-content">
                    {title}
                </LinkPanel.Title>
                <LinkPanel.Description className="navds-link-panel__description navds-body-long image-link-panel-content">
                    {description}
                </LinkPanel.Description>
            </LinkPanel>
        </div>
    );
}
