import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BodyLong, BodyShort, Button, Heading, Link as AkselLink } from "@navikt/ds-react";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { formatDate, isValidEmail, isValidUrl } from "../../../common/components/utils";
import "./HowToApply.css";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import FavouritesButton from "../../favourites/components/FavouritesButton";
import { CONTEXT_PATH } from "../../../common/environment";

export function getApplicationUrl(source, properties) {
    if (source === "FINN") {
        return properties.sourceurl;
    }
    if (properties.applicationurl !== undefined) {
        return properties.applicationurl;
    }
    return properties.sourceurl;
}

const applyForPosition = (finn, stilling) => {
    try {
        logAmplitudeEvent("Stilling sok-via-url", {
            title: stilling._source.title,
            id: stilling._id,
        });
    } catch (e) {
        // ignore
    }
};

export default function HowToApply({ stilling, showFavouriteButton }) {
    const { properties } = stilling._source;
    const applicationUrl = getApplicationUrl(stilling._source.source, properties);
    const isFinn = stilling._source.source === "FINN";
    const path = "stilling";

    if (properties.hasInterestform === "true") {
        return (
            <section className="JobPosting__section HowToApply">
                <Heading level="2" size="medium" spacing>
                    Søk på jobben
                </Heading>

                {stilling._source.status === "ACTIVE" && (
                    <BodyShort spacing>Vis frem deg selv og din erfaring med en superrask søknad.</BodyShort>
                )}

                {properties.applicationdue && (
                    <dl className="JobPosting__dl">
                        <dt>Søknadsfrist</dt>
                        <dd>{formatDate(properties.applicationdue)}</dd>
                    </dl>
                )}

                {stilling._source.status === "ACTIVE" && (
                    <div>
                        <Button
                            as={Link}
                            onClick={() => {
                                logAmplitudeEvent("click superrask søknad link", {
                                    id: stilling._id,
                                });
                            }}
                            to={`${CONTEXT_PATH}/${path}/${stilling._id}/superrask-soknad`}
                            className="HowToApply__full-width-button"
                        >
                            Gå til superrask søknad
                        </Button>
                    </div>
                )}

                {!isFinn && properties.applicationemail && (
                    <BodyLong className="mt-1">
                        Alternativt kan du sende søknad via e-post til{" "}
                        {isValidEmail(properties.applicationemail) ? (
                            <AkselLink href={`mailto:${properties.applicationemail}`}>
                                {properties.applicationemail}
                            </AkselLink>
                        ) : (
                            properties.applicationemail
                        )}
                    </BodyLong>
                )}

                {applicationUrl && (
                    <>
                        {isValidUrl(applicationUrl) ? (
                            <BodyLong className="mt-1">
                                Alternativt kan du{" "}
                                <AkselLink href={applicationUrl} onClick={() => applyForPosition(isFinn, stilling)}>
                                    sende søknad her.
                                </AkselLink>
                            </BodyLong>
                        ) : (
                            <BodyLong className="mt-1">Alternativt kan du sende søknad på {applicationUrl}.</BodyLong>
                        )}
                    </>
                )}

                {showFavouriteButton && (
                    <FavouritesButton
                        className="HowToApply__favourite-button HowToApply__full-width-button"
                        type="knapp"
                        id={stilling._id}
                        stilling={stilling._source}
                    />
                )}
            </section>
        );
    }

    if (properties.applicationdue || properties.applicationemail || applicationUrl) {
        return (
            <section className="JobPosting__section HowToApply">
                <Heading level="2" size="medium" spacing>
                    Søk på jobben
                </Heading>
                <dl className="JobPosting__dl">
                    {properties.applicationdue && (
                        <>
                            <dt>Søknadsfrist</dt>
                            <dd>{formatDate(properties.applicationdue)}</dd>
                        </>
                    )}
                    {!isFinn && properties.applicationemail && (
                        <>
                            <dt>Send søknad til</dt>
                            <dd>
                                {isValidEmail(properties.applicationemail) ? (
                                    <AkselLink href={`mailto:${properties.applicationemail}`}>
                                        {properties.applicationemail}
                                    </AkselLink>
                                ) : (
                                    properties.applicationemail
                                )}
                            </dd>
                        </>
                    )}
                    {applicationUrl && !isValidUrl(applicationUrl) && (
                        <>
                            <dt>Søknadslenke</dt>
                            <dd>{applicationUrl}</dd>
                        </>
                    )}
                </dl>

                {applicationUrl && isValidUrl(applicationUrl) && (
                    <div>
                        <Button
                            className="HowToApply__full-width-button"
                            variant="primary"
                            as="a"
                            href={applicationUrl}
                            onClick={() => applyForPosition(isFinn, stilling)}
                            icon={<ExternalLinkIcon aria-hidden="true" />}
                        >
                            Gå til søknad
                        </Button>
                    </div>
                )}

                {isFinn && (
                    <BodyLong className="mt-1">
                        Denne annonsen er hentet fra FINN.no. Du kan sende søknad via den opprinnelige annonsen.
                    </BodyLong>
                )}
                {showFavouriteButton && (
                    <FavouritesButton
                        className="HowToApply__favourite-button HowToApply__full-width-button"
                        type="knapp"
                        id={stilling._id}
                        stilling={stilling._source}
                    />
                )}
            </section>
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
