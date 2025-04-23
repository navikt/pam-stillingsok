import { LinkPanel, LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import NextLink from "next/link";

interface ImageLinkPanelMediumProps {
    href: string;
    image: string;
    alt: string;
    title: string;
    description: string;
    color?: string;
}

export default function ImageLinkPanelMedium({
    href,
    image,
    alt,
    title,
    description,
    color = "primary-solid",
}: ImageLinkPanelMediumProps) {
    return (
        <div className="image-link-panel-medium">
            <div className="image-link-panel-img-medium">
                <img src={image} alt={alt} />
            </div>
            <LinkPanel as={NextLink} className={`arb-link-panel-${color} image-link-panel-link`} href={href}>
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small image-link-panel-content">
                    {title}
                </LinkPanelTitle>
                <LinkPanelDescription className="navds-link-panel__description navds-body-long pl-1_5 image-link-panel-content">
                    {description}
                </LinkPanelDescription>
            </LinkPanel>
        </div>
    );
}
