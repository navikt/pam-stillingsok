import { LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import Image, { StaticImageData } from "next/image";
import { AkselNextLinkPanel } from "@/app/_common/components/AkselNextLinkPanel/AkselNextLinkPanel";

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
        <div className="image-link-panel-small">
            <div className="image-link-panel-img-small">
                <Image fill quality={90} src={image} alt={alt} />
            </div>
            <AkselNextLinkPanel className={`arb-link-panel-${color} image-link-panel-link`} href={href}>
                <LinkPanelTitle className="navds-link-panel__title navds-heading--small image-link-panel-content">
                    {title}
                </LinkPanelTitle>
                <LinkPanelDescription className="navds-link-panel__description navds-body-long image-link-panel-content">
                    {description}
                </LinkPanelDescription>
            </AkselNextLinkPanel>
        </div>
    );
}
