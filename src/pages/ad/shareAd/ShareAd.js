import React from "react";
import PropTypes from "prop-types";
import { UAParser } from "ua-parser-js";
import ShareIcon from "../../../components/icons/ShareIcon";
import FacebookIcon from "../../../components/icons/FacebookIcon";
import LinkedinIcon from "../../../components/icons/LinkedinIcon";
import TwitterIcon from "../../../components/icons/TwitterIcon";
import MessengerIcon from "../../../components/icons/MessengerIcon";
import "./ShareAd.less";

export default function ShareAd({ source }) {
    const title = source.title;
    const deviceType = new UAParser().getResult().device.type;

    return (
        <section className="detail-section">
            <h2 className="detail-section__head">
                <ShareIcon />
                Del annonsen
            </h2>
            <div className="SocialShare">
                <a
                    className="SocialShare__facebook SocialShare__link"
                    href={"https://www.facebook.com/sharer/sharer.php?u=" + location.href}
                    title="Del på Facebook"
                    rel="noopener noreferrer"
                >
                    <FacebookIcon />
                    <div className="SocialShare__text">Facebook</div>
                </a>
                <a
                    className="SocialShare__linkedin SocialShare__link"
                    href={"https://www.linkedin.com/shareArticle?mini=true&url=" + location.href}
                    title="Del på Linkedin"
                    rel="noopener noreferrer"
                >
                    <LinkedinIcon />
                    <div className="SocialShare__text">Linkedin</div>
                </a>
                <a
                    className="SocialShare__twitter SocialShare__link"
                    href={"https://twitter.com/intent/tweet?url=" + location.href + "&text=" + encodeURI(title)}
                    title="Del på Twitter"
                    rel="noopener noreferrer"
                >
                    <TwitterIcon />
                    <div className="SocialShare__text">Twitter</div>
                </a>

                {(deviceType === "mobile" || deviceType === "tablet") && (
                    <a
                        className="SocialShare__messenger SocialShare__link"
                        href={"fb-messenger://share/?link=" + encodeURIComponent(location.href)}
                        title="Del i Messenger"
                        rel="noopener noreferrer"
                    >
                        <MessengerIcon />
                        <div className="SocialShare__text">Messenger</div>
                    </a>
                )}
            </div>
        </section>
    );
}

ShareAd.propTypes = {
    source: PropTypes.shape({
        title: PropTypes.string
    }).isRequired
};
