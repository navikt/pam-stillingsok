import React from "react";
import PropTypes from "prop-types";
import { UAParser } from "ua-parser-js";
import { Heading, Link as AkselLink } from "@navikt/ds-react";
import FacebookIcon from "../../../common/components/icons/FacebookIcon";
import LinkedinIcon from "../../../common/components/icons/LinkedinIcon";
import TwitterIcon from "../../../common/components/icons/TwitterIcon";
import MessengerIcon from "../../../common/components/icons/MessengerIcon";
import "./ShareAd.css";

export default function ShareAd({ source }) {
    const { title } = source;
    const deviceType = new UAParser().getResult().device.type;

    return (
        <section className="JobPosting__section">
            <Heading level="2" size="medium" spacing>
                Del annonsen
            </Heading>
            <div className="SocialShare">
                <AkselLink
                    className="SocialShare__facebook"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    rel="noopener noreferrer"
                >
                    <FacebookIcon />
                    Del på Facebook
                </AkselLink>
                <AkselLink
                    className="SocialShare__linkedin"
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
                    rel="noopener noreferrer"
                >
                    <LinkedinIcon />
                    Del på LinkedIn
                </AkselLink>
                <AkselLink
                    className="SocialShare__twitter"
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURI(title)}`}
                    rel="noopener noreferrer"
                >
                    <TwitterIcon />
                    Del på Twitter
                </AkselLink>

                {(deviceType === "mobile" || deviceType === "tablet") && (
                    <AkselLink
                        className="SocialShare__messenger"
                        href={`fb-messenger://share/?link=${encodeURIComponent(window.location.href)}`}
                        rel="noopener noreferrer"
                    >
                        <MessengerIcon />
                        Del på Messenger
                    </AkselLink>
                )}
            </div>
        </section>
    );
}

ShareAd.propTypes = {
    source: PropTypes.shape({
        title: PropTypes.string,
    }).isRequired,
};
