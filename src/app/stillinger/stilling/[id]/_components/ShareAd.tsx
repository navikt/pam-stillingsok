import { Button, Heading, HStack } from "@navikt/ds-react";
import type { ReactNode } from "react";
import { track } from "@/app/_common/umami";
import { DEL_ANNONSE_FACEBOOK, DEL_ANNONSE_LINKEDIN, DEL_ANNONSE_X } from "@/app/_common/umami/constants";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import FacebookIcon from "./icons/FacebookIcon";
import LinkedinIcon from "./icons/LinkedinIcon";
import TwitterIcon from "./icons/TwitterIcon";

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
            <HStack gap="space-8">
                <Button
                    aria-label="Del annonse på Facebook"
                    as="a"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareAdRedirectUrl}`}
                    rel="noopener noreferrer"
                    variant="secondary"
                    icon={<FacebookIcon />}
                    onClick={() => {
                        track(DEL_ANNONSE_FACEBOOK, {
                            annonseId: adData.id || "",
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
                        track(DEL_ANNONSE_LINKEDIN, {
                            annonseId: adData.id || "",
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
                        track(DEL_ANNONSE_X, {
                            annonseId: adData.id || "",
                            ad: shareAdRedirectUrl,
                            title: adData.title || "",
                        });
                    }}
                />
            </HStack>
        </section>
    );
}
