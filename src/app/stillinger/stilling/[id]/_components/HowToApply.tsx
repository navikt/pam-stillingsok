import React, { ReactNode } from "react";
import { BodyLong, Box, Button, CopyButton, Heading, HStack, Label, Stack, VStack } from "@navikt/ds-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { isValidUrl } from "@/app/stillinger/_common/utils/utils";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { KONTAKTER_ARBEIDSGIVER } from "@/app/_common/umami/constants";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type PageProps = {
    adData: AdDTO;
};
export default function HowToApply({ adData }: PageProps): ReactNode {
    // TODO: skal man bruke sourceUrl, eller skulle det droppes?
    const applicationUrl = adData.application.applicationUrl || adData.sourceUrl;
    const isFinn = adData.source === "FINN";
    const path = "stilling";

    const deadlineMessage = getDeadlineMessage({
        dueDateIso: adData.application.applicationDueDate,
        dueLabel: adData.application.applicationDueLabel,
        now: new Date(),
    });

    if (adData.application.hasSuperraskSoknad) {
        return (
            <Box background="surface-alt-1-moderate" borderRadius="medium" padding="4" className="full-width mb-10">
                <Stack
                    gap="4"
                    direction={{ xs: "column", sm: "row" }}
                    justify="space-between"
                    align={{ xs: "start", sm: "center" }}
                >
                    <VStack>
                        <Heading level="2" size="small" className="mb-1">
                            Søk på jobben
                        </Heading>
                        {deadlineMessage && <BodyLong>{deadlineMessage}</BodyLong>}
                    </VStack>
                    {adData.status === "ACTIVE" && (
                        <div>
                            <Button
                                as={Link}
                                href={`/stillinger/${path}/${adData.id}/superrask-soknad`}
                                prefetch={false}
                                onClick={() => {
                                    umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                        adid: adData.id || "",
                                        title: adData.title || "",
                                        href: `/stillinger/${path}/${adData.id}/superrask-soknad`,
                                        source: "Superrask søknad",
                                    });
                                }}
                            >
                                Gå til superrask søknad
                            </Button>
                        </div>
                    )}
                </Stack>
                {!isFinn && adData.application.applicationEmail && (
                    <BodyLong className="mt-4">
                        Alternativt kan du sende søknad via e-post til{" "}
                        <HStack gap="2" as="span" wrap={false}>
                            <span>
                                <AkselNextLink
                                    href={`mailto:${adData.application.applicationEmail}`}
                                    onClick={() => {
                                        umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                            adid: adData.id || "",
                                            title: adData.title || "",
                                            source: "Søker via e-post",
                                        });
                                    }}
                                >
                                    {adData.application.applicationEmail}
                                </AkselNextLink>
                            </span>
                            <span>
                                <CopyButton
                                    title="Kopier e-postadresse"
                                    copyText={`${adData.application.applicationEmail}`}
                                    variant="action"
                                    size="xsmall"
                                    onClick={() => {
                                        umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                            adid: adData.id || "",
                                            title: adData.title || "",
                                            source: "Kopierer e-post",
                                        });
                                    }}
                                />
                            </span>
                        </HStack>
                    </BodyLong>
                )}
                {applicationUrl && (
                    <BodyLong className="mt-4">
                        Alternativt kan du{" "}
                        <AkselNextLink
                            href={applicationUrl}
                            onClick={() => {
                                umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                    adid: adData.id || "",
                                    title: adData.title || "",
                                    href: applicationUrl,
                                    source: "Ekstern søknadslenke",
                                });
                            }}
                        >
                            sende søknad her.
                        </AkselNextLink>
                    </BodyLong>
                )}
            </Box>
        );
    }

    if (adData.application.applicationDueDate || adData.application.applicationEmail || applicationUrl) {
        return (
            <Box background="surface-alt-1-moderate" borderRadius="medium" padding="4" className="full-width mb-10">
                <Stack
                    wrap={false}
                    gap="4"
                    direction={{ xs: "column", sm: "row" }}
                    justify="space-between"
                    align={{ xs: "start", sm: "center" }}
                >
                    <VStack className="flex-shrink-0">
                        <Heading level="2" size="small" className="mb-1">
                            Søk på jobben
                        </Heading>
                        {deadlineMessage && <BodyLong>{deadlineMessage}</BodyLong>}
                    </VStack>
                    {applicationUrl && isValidUrl(applicationUrl) && (
                        <div>
                            <Button
                                variant="primary"
                                as={Link}
                                href={applicationUrl}
                                icon={<ExternalLinkIcon aria-hidden="true" />}
                                role="link"
                                onClick={() => {
                                    umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                        adid: adData.id || "",
                                        title: adData.title || "",
                                        href: applicationUrl,
                                        source: "Ekstern søknadslenke",
                                    });
                                }}
                            >
                                Gå til søknad
                            </Button>
                        </div>
                    )}
                    {!isFinn && adData.application.applicationEmail && !applicationUrl && (
                        <div className="max-width-100 text-align-right overflow-hidden align-self-normal">
                            <Label as="p" className="lh-1-75 mb-1 text-left-small">
                                Send søknad til
                            </Label>
                            <BodyLong>
                                <HStack gap="2" as="span" wrap={false} className="overflow-hidden">
                                    <span className="overflow-hidden text-overflow-ellipsis">
                                        <AkselNextLink
                                            className="display-inline"
                                            href={`mailto:${adData.application.applicationEmail}`}
                                            onClick={() => {
                                                umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                                    adid: adData.id || "",
                                                    title: adData.title || "",
                                                    source: "Søker via e-post",
                                                });
                                            }}
                                        >
                                            {adData.application.applicationEmail}
                                        </AkselNextLink>
                                    </span>
                                    <span>
                                        <CopyButton
                                            title="Kopier e-postadresse"
                                            copyText={`${adData.application.applicationEmail}`}
                                            variant="action"
                                            size="xsmall"
                                            onClick={() => {
                                                umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                                    adid: adData.id || "",
                                                    title: adData.title || "",
                                                    source: "Kopierer e-post",
                                                });
                                            }}
                                        />
                                    </span>
                                </HStack>
                            </BodyLong>
                        </div>
                    )}
                </Stack>
                {!isFinn && adData.application.applicationEmail && applicationUrl && (
                    <BodyLong className="mt-4">
                        Alternativt kan du sende søknad via e-post til{" "}
                        <HStack gap="2" as="span" wrap={false}>
                            <span>
                                <AkselNextLink
                                    href={`mailto:${adData.application.applicationEmail}`}
                                    onClick={() => {
                                        umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                            adid: adData.id || "",
                                            title: adData.title || "",
                                            source: "Søker via e-post",
                                        });
                                    }}
                                >
                                    {adData.application.applicationEmail}
                                </AkselNextLink>
                            </span>
                            <span>
                                <CopyButton
                                    title="Kopier e-postadresse"
                                    copyText={`${adData.application.applicationEmail}`}
                                    variant="action"
                                    size="xsmall"
                                    onClick={() => {
                                        umamiTracking(KONTAKTER_ARBEIDSGIVER, {
                                            adid: adData.id || "",
                                            title: adData.title || "",
                                            source: "Kopierer e-post",
                                        });
                                    }}
                                />
                            </span>
                        </HStack>
                    </BodyLong>
                )}

                {applicationUrl && !isValidUrl(applicationUrl) && (
                    <>
                        <Label as="p">Søknadslenke</Label>
                        <BodyLong>{applicationUrl}</BodyLong>
                    </>
                )}
                {isFinn && !adData.application.applicationUrl && (
                    <BodyLong className="mt-4">Søk via opprinnelig annonse på FINN.no.</BodyLong>
                )}
            </Box>
        );
    }
    return null;
}
