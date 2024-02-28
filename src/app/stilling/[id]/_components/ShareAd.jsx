import React from "react";
import PropTypes from "prop-types";
import { UAParser } from "ua-parser-js";
import { BodyShort, Heading, Link as AkselLink, VStack } from "@navikt/ds-react";
import FacebookIcon from "./icons/FacebookIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import TwitterIcon from "./icons/TwitterIcon";
import MessengerIcon from "./icons/MessengerIcon";

export default function ShareAd({ source, id }) {
    const { title } = source;
    const deviceType = new UAParser().getResult().device.type;
    const shareAdRedirectUrl = `https://arbeidsplassen.nav.no/stillinger/stilling/${id}`;

    return (
        <section className="full-width mb-10">
            <Heading level="2" size="medium" spacing>
                Del annonsen
            </Heading>
            <VStack gap="4">
                <BodyShort>
                    <AkselLink
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareAdRedirectUrl}`}
                        rel="noopener noreferrer"
                    >
                        <FacebookIcon />
                        Del på Facebook
                    </AkselLink>
                </BodyShort>

                <BodyShort>
                    <AkselLink
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareAdRedirectUrl}`}
                        rel="noopener noreferrer"
                    >
                        <LinkedinIcon />
                        Del på LinkedIn
                    </AkselLink>
                </BodyShort>

                <BodyShort>
                    <AkselLink
                        href={`https://twitter.com/intent/tweet?url=${shareAdRedirectUrl}&text=${encodeURI(title)}`}
                        rel="noopener noreferrer"
                    >
                        <TwitterIcon />
                        Del på Twitter
                    </AkselLink>
                </BodyShort>

                {(deviceType === "mobile" || deviceType === "tablet") && (
                    <BodyShort>
                        <AkselLink
                            href={`fb-messenger://share/?link=${encodeURIComponent(shareAdRedirectUrl)}`}
                            rel="noopener noreferrer"
                        >
                            <MessengerIcon />
                            Del på Messenger
                        </AkselLink>
                    </BodyShort>
                )}
            </VStack>
        </section>
    );
}

ShareAd.propTypes = {
    source: PropTypes.shape({
        title: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
};
