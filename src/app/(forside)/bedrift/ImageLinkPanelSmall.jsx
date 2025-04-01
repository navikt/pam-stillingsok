import { LinkPanel } from "@navikt/ds-react";
import PropTypes from "prop-types";
import NextLink from "next/link";

function ImageLinkPanelSmall({ href, image, alt, title, description, color = "primary-solid", ...args }) {
    return (
        <div className="image-link-panel-small">
            <div className="image-link-panel-img-small">
                <img src={image} alt={alt} />
            </div>
            <LinkPanel as={NextLink} className={`arb-link-panel-${color} image-link-panel-link`} href={href} {...args}>
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

ImageLinkPanelSmall.propTypes = {
    href: PropTypes.string,
    image: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
};

export default ImageLinkPanelSmall;
