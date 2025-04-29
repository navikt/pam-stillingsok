import React, { ReactNode } from "react";
import { Button, Heading, HStack } from "@navikt/ds-react";
import { StillingDetaljer } from "@/app/stillinger/_common/lib/stillingSchema";
import FacebookIcon from "./icons/FacebookIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import TwitterIcon from "./icons/TwitterIcon";
import { umamiTracking } from "@/app/_common/umamiTracking";

type PageProps = {
    adData: StillingDetaljer;
};
export default function ShareAd({ adData }: PageProps): ReactNode {
    const shareAdRedirectUrl = `https://arbeidsplassen.nav.no/stillinger/stilling/${adData.id}`;

    return (
        <section className="full-width mb-8">
            <Heading level="2" size="medium" spacing>
                Del annonsen
            </Heading>
            <HStack gap="2">
                <Button
                    aria-label="Del annonse på Facebook"
                    as="a"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareAdRedirectUrl}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<FacebookIcon />}
                    onClick={() => {
                        umamiTracking("Del annonse på Facebook", {
                            adid: adData.id || "",
                            ad: shareAdRedirectUrl,
                            title: adData.title || "",
                        });
                    }}
                />
                <Button
                    aria-label="Del annonse på LinkedIn"
                    as="a"
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareAdRedirectUrl}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<LinkedinIcon />}
                    onClick={() => {
                        umamiTracking("Del annonse på LinkedIn", {
                            adid: adData.id || "",
                            ad: shareAdRedirectUrl,
                            title: adData.title || "",
                        });
                    }}
                />
                <Button
                    aria-label="Del annonse på Twitter"
                    as="a"
                    href={`https://twitter.com/intent/tweet?url=${shareAdRedirectUrl}&text=${encodeURI(adData?.title ?? "")}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<TwitterIcon />}
                    onClick={() => {
                        umamiTracking("Del annonse på X", {
                            adid: adData.id || "",
                            ad: shareAdRedirectUrl,
                            title: adData.title || "",
                        });
                    }}
                />
            </HStack>
        </section>
    );
}
