import React, { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
import PropTypes from "prop-types";
import { BodyLong, BodyShort, Box, Button, CopyButton, Heading, HStack, Label } from "@navikt/ds-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { formatDate, isValidEmail, isValidUrl } from "@/app/_common/utils/utils";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";

export function getApplicationUrl(properties) {
    if (properties.applicationurl !== undefined) {
        return properties.applicationurl;
    }
    return properties.sourceurl;
}

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

export default function HowToApply({ stilling, showFavouriteButton }) {
    const { properties } = stilling._source;
    const applicationUrl = getApplicationUrl(properties);
    const isFinn = stilling._source.source === "FINN";
    const path = "stilling";
    const [useBlueBackground, setUseBlueBackground] = useState(false);
    const cookies = useCookies();

    useEffect(() => {
        if (cookies.get("APPLY_JOB_BOX_COLOR") === "blue") {
            setUseBlueBackground(true);
        }
    }, []);

    if (properties.hasInterestform === "true") {
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
                {stilling._source.status === "ACTIVE" && (
                    <BodyShort spacing>Vis frem deg selv og din erfaring med en superrask søknad.</BodyShort>
                )}
                {properties.applicationdue && (
                    <dl className="dl">
                        <dt>
                            <Label as="p">Søknadsfrist</Label>
                        </dt>
                        <dd>
                            <BodyLong>{formatDate(properties.applicationdue)}</BodyLong>
                        </dd>
                    </dl>
                )}
                {stilling._source.status === "ACTIVE" && (
                    <div>
                        <Button
                            as={Link}
                            onClick={() => {
                                logAmplitudeEvent("click superrask søknad link", {
                                    id: stilling._id,
                                    experimentApplyBoxColor: useBlueBackground ? "blue" : "green",
                                });
                            }}
                            href={`/${path}/${stilling._id}/superrask-soknad`}
                        >
                            Gå til superrask søknad
                        </Button>
                    </div>
                )}

                {!isFinn && properties.applicationemail && (
                    <BodyLong className="mt-4">
                        Alternativt kan du sende søknad via e-post til{" "}
                        {isValidEmail(properties.applicationemail) ? (
                            <HStack gap="2" as="span" wrap={false}>
                                <span>
                                    <Button
                                        as={Link}
                                        onClick={() => {
                                            logEmailAnchorClick(stilling);
                                        }}
                                        href={`mailto:${properties.applicationemail}`}
                                    >
                                        {properties.applicationemail}
                                    </Button>
                                </span>
                                <span>
                                    <CopyButton
                                        title="Kopier e-postadresse"
                                        copyText={`${properties.applicationemail}`}
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
                            properties.applicationemail
                        )}
                    </BodyLong>
                )}
                {applicationUrl && (
                    <div>
                        {isValidUrl(applicationUrl) ? (
                            <BodyLong className="mt-4">
                                Alternativt kan du{" "}
                                <Button as={Link} href={applicationUrl} onClick={() => logApplyForPosition(stilling)}>
                                    sende søknad her.
                                </Button>
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

    if (properties.applicationdue || properties.applicationemail || applicationUrl) {
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
                    {properties.applicationdue && (
                        <>
                            <dt>
                                <Label as="p">Søknadsfrist</Label>
                            </dt>
                            <dd>
                                <BodyLong>{formatDate(properties.applicationdue)}</BodyLong>
                            </dd>
                        </>
                    )}
                    {!isFinn && properties.applicationemail && (
                        <>
                            <dt>
                                <Label as="p">Send søknad til</Label>
                            </dt>
                            <dd>
                                <BodyLong>
                                    {isValidEmail(properties.applicationemail) ? (
                                        <HStack gap="2" as="span" wrap={false}>
                                            <span>
                                                <Button
                                                    as={Link}
                                                    onClick={() => {
                                                        logEmailAnchorClick(stilling);
                                                    }}
                                                    href={`mailto:${properties.applicationemail}`}
                                                >
                                                    {properties.applicationemail}
                                                </Button>
                                            </span>
                                            <span>
                                                <CopyButton
                                                    title="Kopier e-postadresse"
                                                    copyText={`${properties.applicationemail}`}
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
                                        properties.applicationemail
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
                            as={Link}
                            href={applicationUrl}
                            onClick={() => logApplyForPosition(stilling)}
                            icon={<ExternalLinkIcon aria-hidden="true" />}
                            role="link"
                        >
                            Gå til søknad
                        </Button>
                    </div>
                )}

                {isFinn && !properties.applicationurl && (
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

HowToApply.propTypes = {
    stilling: PropTypes.shape({
        _id: PropTypes.string,
        _source: PropTypes.shape({
            title: PropTypes.string,
            source: PropTypes.string,
            status: PropTypes.string,
            properties: PropTypes.shape({
                applicationdue: PropTypes.string,
                applicationemail: PropTypes.string,
                applicationurl: PropTypes.string,
                sourceurl: PropTypes.string,
                hasInterestform: PropTypes.string,
            }),
        }),
    }).isRequired,
    showFavouriteButton: PropTypes.bool.isRequired,
};
