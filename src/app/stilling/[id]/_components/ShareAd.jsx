import React from "react";
import PropTypes from "prop-types";
import { BodyShort, Heading, Link as AkselLink, VStack } from "@navikt/ds-react";
import FacebookIcon from "./icons/FacebookIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import TwitterIcon from "./icons/TwitterIcon";

export default function ShareAd({ adData }) {
    const shareAdRedirectUrl = `https://arbeidsplassen.nav.no/stillinger/stilling/${adData.id}`;

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
                        href={`https://twitter.com/intent/tweet?url=${shareAdRedirectUrl}&text=${encodeURI(
                            adData.title,
                        )}`}
                        rel="noopener noreferrer"
                    >
                        <TwitterIcon />
                        Del på Twitter
                    </AkselLink>
                </BodyShort>
            </VStack>
        </section>
    );
}

ShareAd.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
};
