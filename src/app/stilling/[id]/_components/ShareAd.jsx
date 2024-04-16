import React from "react";
import PropTypes from "prop-types";
import { Button, Heading, HStack } from "@navikt/ds-react";
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
            <HStack gap="4">
                <Button
                    aria-label="Del annonse på Facebook"
                    as="a"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareAdRedirectUrl}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<FacebookIcon />}
                />
                <Button
                    aria-label="Del annonse på LinkedIn"
                    as="a"
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareAdRedirectUrl}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<LinkedinIcon />}
                />
                <Button
                    aria-label="Del annonse på Twitter"
                    as="a"
                    href={`https://twitter.com/intent/tweet?url=${shareAdRedirectUrl}&text=${encodeURI(adData.title)}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<TwitterIcon />}
                />
            </HStack>
        </section>
    );
}

ShareAd.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
};
