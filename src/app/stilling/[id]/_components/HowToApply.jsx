import React, { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
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
import { formatDate, isValidEmail, isValidUrl } from "@/app/_common/utils/utils";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";

const logApplyForPosition = (stilling) => {
    try {
        logAmplitudeEvent("Stilling sok-via-url", {
            title: stilling._source.title,
            id: stilling._id,
            experimentApplyBoxColor: useBlueBackground ? "blue" : "green",
        });
    } catch (e) {
        // ignore
    }
};

const logCopyEmailClick = (stilling) => {
    try {
        logAmplitudeEvent("Stilling copy-email", {
            title: stilling._source.title,
            id: stilling._id,
            experimentApplyBoxColor: useBlueBackground ? "blue" : "green",
        });
    } catch (e) {
        // ignore
    }
};

const logEmailAnchorClick = (stilling) => {
    try {
        logAmplitudeEvent("Stilling email-anchor-click", {
            title: stilling._source.title,
            id: stilling._id,
            experimentApplyBoxColor: useBlueBackground ? "blue" : "green",
        });
    } catch (e) {
        // ignore
    }
};

export default function HowToApply({ adData, showFavouriteButton }) {
    const applicationUrl = adData.applicationUrl || adData.sourceUrl;
    const isFinn = adData.source === "FINN";
    const path = "stilling";
    const [useBlueBackground, setUseBlueBackground] = useState(false);
    const cookies = useCookies();

    useEffect(() => {
        if (cookies.get("APPLY_JOB_BOX_COLOR") === "blue") {
            setUseBlueBackground(true);
        }
    }, []);

    if (adData.hasSuperraskSoknad === "true") {
        return (
            <Box
                background={useBlueBackground ? "surface-alt-2-subtle" : "surface-alt-1-subtle"}
                borderRadius="medium"
                padding="4"
                className="full-width mb-10"
            >
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
                                    experimentApplyBoxColor: useBlueBackground ? "blue" : "green",
                                });
                            }}
                            href={`/${path}/${stilling._id}/superrask-soknad`}
                        >
                            Gå til superrask søknad
                        </Button>
                    </div>
                )}

                {!isFinn && adData.applicationEmail && (
                    <BodyLong className="mt-4">
                        Alternativt kan du sende søknad via e-post til{" "}
                        {adData.applicationEmail ? (
                            <HStack gap="2" as="span" wrap={false}>
                                <span>
                                    <AkselLink
                                        onClick={() => {
                                            logEmailAnchorClick(stilling);
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
                                                logCopyEmailClick(stilling);
                                            }
                                        }}
                                    />
                                </span>
                            </HStack>
                        ) : (
                            adData.applicationEmail
                        )}
                    </BodyLong>
                )}
                {applicationUrl && (
                    <div>
                        {isValidUrl(applicationUrl) ? (
                            <BodyLong className="mt-4">
                                Alternativt kan du{" "}
                                <AkselLink href={applicationUrl} onClick={() => logApplyForPosition(stilling)}>
                                    sende søknad her.
                                </AkselLink>
                            </BodyLong>
                        ) : (
                            <BodyLong className="mt-4">Alternativt kan du sende søknad på {applicationUrl}.</BodyLong>
                        )}
                    </div>
                )}
                {showFavouriteButton && (
                    <FavouritesButton
                        className="mt-4"
                        variant="secondary"
                        id={stilling._id}
                        stilling={stilling._source}
                    />
                )}
            </Box>
        );
    }

    if (adData.applicationDue || adData.applicationEmail || applicationUrl) {
        return (
            <Box
                background={useBlueBackground ? "surface-alt-2-subtle" : "surface-alt-1-subtle"}
                borderRadius="medium"
                padding="4"
                className="full-width mb-10"
            >
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
                                    {adData.applicationEmail ? (
                                        <HStack gap="2" as="span" wrap={false}>
                                            <span>
                                                <AkselLink
                                                    onClick={() => {
                                                        logEmailAnchorClick(stilling);
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
                                                            logCopyEmailClick(stilling);
                                                        }
                                                    }}
                                                />
                                            </span>
                                        </HStack>
                                    ) : (
                                        adData.applicationEmail
                                    )}
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
                            onClick={() => logApplyForPosition(stilling)}
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
                {showFavouriteButton && (
                    <FavouritesButton
                        className="mt-4"
                        variant="secondary"
                        id={stilling._id}
                        stilling={stilling._source}
                    />
                )}
            </Box>
        );
    }
    return null;
}
