import React, { ReactNode } from "react";
import {
    BodyLong,
    Box,
    Button,
    CopyButton,
    Heading,
    HStack,
    Label,
    Link as AkselLink,
    Stack,
    VStack,
} from "@navikt/ds-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { formatDate, isValidUrl } from "@/app/_common/utils/utils";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import deadlineText from "@/app/_common/utils/deadlineText";
import { MappedAdDTO } from "@/app/lib/stillingSchema";

const logApplyForPosition = (adData: MappedAdDTO): void => {
    try {
        logAmplitudeEvent("Stilling sok-via-url", {
            title: adData.title,
            id: adData.id,
        });
    } catch (e) {
        // ignore
    }
};

const logCopyEmailClick = (adData: MappedAdDTO): void => {
    try {
        logAmplitudeEvent("Stilling copy-email", {
            title: adData.title,
            id: adData.id,
        });
    } catch (e) {
        // ignore
    }
};

const logEmailAnchorClick = (adData: MappedAdDTO): void => {
    try {
        logAmplitudeEvent("Stilling email-anchor-click", {
            title: adData.title,
            id: adData.id,
        });
    } catch (e) {
        // ignore
    }
};

type PageProps = {
    adData: MappedAdDTO;
};
export default function HowToApply({ adData }: PageProps): ReactNode {
    const applicationUrl = adData.applicationUrl || adData.sourceUrl;
    const isFinn = adData.source === "FINN";
    const path = "stilling";
    const deadline = adData.applicationDue ? formatDate(adData.applicationDue) : undefined;

    if (adData.hasSuperraskSoknad === "true") {
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
                        {deadline && adData.applicationDue && (
                            <BodyLong>{deadlineText(deadline, new Date(), adData.applicationDue)}</BodyLong>
                        )}
                    </VStack>
                    {adData.status === "ACTIVE" && (
                        <div>
                            <Button
                                as={Link}
                                onClick={() => {
                                    logAmplitudeEvent("click superrask søknad link", {
                                        id: adData.id,
                                    });
                                }}
                                href={`/${path}/${adData.id}/superrask-soknad`}
                                prefetch={false}
                            >
                                Gå til superrask søknad
                            </Button>
                        </div>
                    )}
                </Stack>
                {!isFinn && adData.applicationEmail && (
                    <BodyLong className="mt-4">
                        Alternativt kan du sende søknad via e-post til{" "}
                        <HStack gap="2" as="span" wrap={false}>
                            <span>
                                <AkselLink
                                    onClick={() => {
                                        logEmailAnchorClick(adData);
                                    }}
                                    href={`mailto:${adData.applicationEmail}`}
                                >
                                    {adData.applicationEmail}
                                </AkselLink>
                            </span>
                            <span>
                                <CopyButton
                                    title="Kopier e-postadresse"
                                    copyText={`${adData.applicationEmail}`}
                                    variant="action"
                                    size="xsmall"
                                    onActiveChange={(state) => {
                                        if (state === true) {
                                            logCopyEmailClick(adData);
                                        }
                                    }}
                                />
                            </span>
                        </HStack>
                    </BodyLong>
                )}
                {applicationUrl && (
                    <BodyLong className="mt-4">
                        Alternativt kan du{" "}
                        <AkselLink href={applicationUrl} onClick={() => logApplyForPosition(adData)}>
                            sende søknad her.
                        </AkselLink>
                    </BodyLong>
                )}
            </Box>
        );
    }

    if (adData.applicationDue || adData.applicationEmail || applicationUrl) {
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
                        {deadline && adData.applicationDue && (
                            <BodyLong>{deadlineText(deadline, new Date(), adData.applicationDue)}</BodyLong>
                        )}
                    </VStack>
                    {applicationUrl && isValidUrl(applicationUrl) && (
                        <div>
                            <Button
                                variant="primary"
                                as={Link}
                                href={applicationUrl}
                                onClick={() => logApplyForPosition(adData)}
                                icon={<ExternalLinkIcon aria-hidden="true" />}
                                role="link"
                            >
                                Gå til søknad
                            </Button>
                        </div>
                    )}
                    {!isFinn && adData.applicationEmail && !applicationUrl && (
                        <div className="max-width-100 text-align-right overflow-hidden align-self-normal">
                            <Label as="p" className="lh-1-75 mb-1 text-left-small">
                                Send søknad til
                            </Label>
                            <BodyLong>
                                <HStack gap="2" as="span" wrap={false} className="overflow-hidden">
                                    <span className="overflow-hidden text-overflow-ellipsis">
                                        <AkselLink
                                            className="display-inline"
                                            onClick={() => {
                                                logEmailAnchorClick(adData);
                                            }}
                                            href={`mailto:${adData.applicationEmail}`}
                                        >
                                            {adData.applicationEmail}
                                        </AkselLink>
                                    </span>
                                    <span>
                                        <CopyButton
                                            title="Kopier e-postadresse"
                                            copyText={`${adData.applicationEmail}`}
                                            variant="action"
                                            size="xsmall"
                                            onActiveChange={(state) => {
                                                if (state === true) {
                                                    logCopyEmailClick(adData);
                                                }
                                            }}
                                        />
                                    </span>
                                </HStack>
                            </BodyLong>
                        </div>
                    )}
                </Stack>
                {!isFinn && adData.applicationEmail && applicationUrl && (
                    <BodyLong className="mt-4">
                        Alternativt kan du sende søknad via e-post til{" "}
                        <HStack gap="2" as="span" wrap={false}>
                            <span>
                                <AkselLink
                                    onClick={() => {
                                        logEmailAnchorClick(adData);
                                    }}
                                    href={`mailto:${adData.applicationEmail}`}
                                >
                                    {adData.applicationEmail}
                                </AkselLink>
                            </span>
                            <span>
                                <CopyButton
                                    title="Kopier e-postadresse"
                                    copyText={`${adData.applicationEmail}`}
                                    variant="action"
                                    size="xsmall"
                                    onActiveChange={(state) => {
                                        if (state === true) {
                                            logCopyEmailClick(adData);
                                        }
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
                {isFinn && !adData.applicationUrl && (
                    <BodyLong className="mt-4">Søk via opprinnelig annonse på FINN.no.</BodyLong>
                )}
            </Box>
        );
    }
    return null;
}
