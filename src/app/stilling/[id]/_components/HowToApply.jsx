import React from "react";
import PropTypes from "prop-types";
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

const logApplyForPosition = (adData) => {
    try {
        logAmplitudeEvent("Stilling sok-via-url", {
            title: adData.title,
            id: adData.id,
        });
    } catch (e) {
        // ignore
    }
};

const logCopyEmailClick = (adData) => {
    try {
        logAmplitudeEvent("Stilling copy-email", {
            title: adData.title,
            id: adData.id,
        });
    } catch (e) {
        // ignore
    }
};

const logEmailAnchorClick = (adData) => {
    try {
        logAmplitudeEvent("Stilling email-anchor-click", {
            title: adData.title,
            id: adData.id,
        });
    } catch (e) {
        // ignore
    }
};

export default function HowToApply({ adData }) {
    const applicationUrl =
        (adData.applicationUrl && (adData.applicationUrl.url || adData.applicationUrl.dangerouslyInvalidUrl)) ||
        (adData.sourceUrl && (adData.sourceUrl.url || adData.sourceUrl.dangerouslyInvalidUrl));
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
                        <Heading level="2" size="medium" spacing>
                            Søk på jobben
                        </Heading>
                        {deadline && <BodyLong>{deadlineText(deadline, new Date(), adData.applicationDue)}</BodyLong>}
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
                    <>
                        <BodyLong className="mt-4">
                            Alternativt kan du{" "}
                            <AkselLink href={applicationUrl} onClick={() => logApplyForPosition(adData)}>
                                sende søknad her.
                            </AkselLink>
                        </BodyLong>
                    </>
                )}
            </Box>
        );
    }

    if (adData.applicationDue || adData.applicationEmail || applicationUrl) {
        return (
            <Box background="surface-alt-1-moderate" borderRadius="medium" padding="4" className="full-width mb-10">
                <Stack
                    gap="4"
                    direction={{ xs: "column", sm: "row" }}
                    justify="space-between"
                    align={{ xs: "start", sm: "center" }}
                >
                    <VStack>
                        <Heading level="2" size="medium" spacing>
                            Søk på jobben
                        </Heading>
                        {deadline && <BodyLong>{deadlineText(deadline, new Date(), adData.applicationDue)}</BodyLong>}
                    </VStack>
                    {applicationUrl && isValidUrl(applicationUrl) && (
                        <div>
                            <Button
                                variant="primary"
                                as="a"
                                href={applicationUrl}
                                onClick={() => logApplyForPosition(adData)}
                                icon={<ExternalLinkIcon aria-hidden="true" />}
                                role="link"
                            >
                                Gå til søknad
                            </Button>
                        </div>
                    )}
                </Stack>
                {!isFinn && adData.applicationEmail && (
                    <div className="mt-4">
                        <Label as="p">Send søknad til</Label>
                        <BodyLong>
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
                    </div>
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

HowToApply.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        applicationUrl: PropTypes.shape({
            url: PropTypes.string,
            dangerouslyInvalidUrl: PropTypes.string,
        }),
        sourceUrl: PropTypes.shape({
            url: PropTypes.string,
            dangerouslyInvalidUrl: PropTypes.string,
        }),
        source: PropTypes.string,
        hasSuperraskSoknad: PropTypes.string,
        applicationDue: PropTypes.string,
        applicationEmail: PropTypes.string,
    }).isRequired,
};
