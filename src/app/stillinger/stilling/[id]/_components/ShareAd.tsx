import React, { ReactNode } from "react";
import { Button, Heading, HStack } from "@navikt/ds-react";
import FacebookIcon from "./icons/FacebookIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import TwitterIcon from "./icons/TwitterIcon";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { DEL_ANNONSE_FACEBOOK, DEL_ANNONSE_LINKEDIN, DEL_ANNONSE_X } from "@/app/_common/umami/constants";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";

type PageProps = {
    adData: AdDTO;
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
                        umamiTracking(DEL_ANNONSE_FACEBOOK, {
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
                        umamiTracking(DEL_ANNONSE_LINKEDIN, {
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
                        umamiTracking(DEL_ANNONSE_X, {
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
