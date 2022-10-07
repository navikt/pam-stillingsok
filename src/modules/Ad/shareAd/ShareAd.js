import React from "react";
import PropTypes from "prop-types";
import { UAParser } from "ua-parser-js";
import ShareIcon from "../../../components/Icon/ShareIcon";
import FacebookIcon from "../../../components/Icon/FacebookIcon";
import LinkedinIcon from "../../../components/Icon/LinkedinIcon";
import TwitterIcon from "../../../components/Icon/TwitterIcon";
import MessengerIcon from "../../../components/Icon/MessengerIcon";
import "./ShareAd.css";

export default function ShareAd({ source }) {
    const title = source.title;
    const deviceType = new UAParser().getResult().device.type;

    return (
        <section className="JobPosting__section">
            <h2 className="JobPosting__h2">
                <ShareIcon />
                Del annonsen
            </h2>
            <div className="SocialShare">
                <a
                    className="SocialShare__facebook SocialShare__link"
                    href={"https://www.facebook.com/sharer/sharer.php?u=" + location.href}
                    rel="noopener noreferrer"
                >
                    <FacebookIcon />
                    <div className="SocialShare__text">Del på Facebook</div>
                </a>
                <a
                    className="SocialShare__linkedin SocialShare__link"
                    href={"https://www.linkedin.com/shareArticle?mini=true&url=" + location.href}
                    rel="noopener noreferrer"
                >
                    <LinkedinIcon />
                    <div className="SocialShare__text">Del på LinkedIn</div>
                </a>
                <a
                    className="SocialShare__twitter SocialShare__link"
                    href={"https://twitter.com/intent/tweet?url=" + location.href + "&text=" + encodeURI(title)}
                    rel="noopener noreferrer"
                >
                    <TwitterIcon />
                    <div className="SocialShare__text">Del på Twitter</div>
                </a>

                {(deviceType === "mobile" || deviceType === "tablet") && (
                    <a
                        className="SocialShare__messenger SocialShare__link"
                        href={"fb-messenger://share/?link=" + encodeURIComponent(location.href)}
                        rel="noopener noreferrer"
                    >
                        <MessengerIcon />
                        <div className="SocialShare__text">Del på Messenger</div>
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
