import React from "react";
import PropTypes from "prop-types";
import {
    BodyLong,
    BodyShort,
    Box,
    Button,
    CopyButton,
    Heading,
    HStack,
    Label,
    Link as AkselLink,
} from "@navikt/ds-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { formatDate, isValidUrl } from "@/app/_common/utils/utils";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

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

    if (adData.hasSuperraskSoknad === "true") {
        return (
            <Box background="surface-alt-1-moderate" borderRadius="medium" padding="4" className="full-width mb-10">
                <Heading level="2" size="medium" spacing>
                    Søk på jobben
                </Heading>
                {adData.status === "ACTIVE" && (
                    <BodyShort spacing>Vis frem deg selv og din erfaring med en superrask søknad.</BodyShort>
                )}
                {adData.applicationDue && (
                    <dl className="dl">
                        <dt>
                            <Label as="p">Søknadsfrist</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatDate(adData.applicationDue)}</BodyLong>
                        </dd>
                    </dl>
                )}
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
                    <div>
                        <BodyLong className="mt-4">
                            Alternativt kan du{" "}
                            <AkselLink href={applicationUrl} onClick={() => logApplyForPosition(adData)}>
                                sende søknad her.
                            </AkselLink>
                        </BodyLong>
                    </div>
                )}
            </Box>
        );
    }

    if (adData.applicationDue || adData.applicationEmail || applicationUrl) {
        return (
            <Box background="surface-alt-1-moderate" borderRadius="medium" padding="4" className="full-width mb-10">
                <Heading level="2" size="medium" spacing>
                    Søk på jobben
                </Heading>
                <dl className="dl">
                    {adData.applicationDue && (
                        <>
                            <dt>
                                <Label as="p">Søknadsfrist</Label>
                            </dt>
                            <dd>
                                <BodyLong>{formatDate(adData.applicationDue)}</BodyLong>
                            </dd>
                        </>
                    )}
                    {!isFinn && adData.applicationEmail && (
                        <>
                            <dt>
                                <Label as="p">Send søknad til</Label>
                            </dt>
                            <dd>
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
                            </dd>
                        </>
                    )}
                    {applicationUrl && !isValidUrl(applicationUrl) && (
                        <>
                            <dt>
                                <Label as="p">Søknadslenke</Label>
                            </dt>
                            <dd>
                                <BodyLong>{applicationUrl}</BodyLong>
                            </dd>
                        </>
                    )}
                </dl>

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
    adLayoutVariant: PropTypes.string,
};
