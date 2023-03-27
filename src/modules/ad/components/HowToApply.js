import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { formatDate, isValidEmail, isValidISOString, isValidUrl } from "../../../common/components/utils";
import "./HowToApply.css";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import FavouritesButton from "../../favourites/components/FavouritesButton";
import { CONTEXT_PATH } from "../../../common/environment";
import { BodyLong, BodyShort, Button, Heading } from "@navikt/ds-react";

export function getApplicationUrl(source, properties) {
    if (source === "FINN") {
        return properties.sourceurl;
    } else if (properties.applicationurl !== undefined) {
        return properties.applicationurl;
    }
    return properties.sourceurl;
}

const applyForPosition = (finn, stilling) => {
    try {
        logAmplitudeEvent("Stilling sok-via-url", {
            title: stilling._source.title,
            id: stilling._id
        });
    } catch (e) {
        // ignore
    }
};

export default function HowToApply({ stilling, showFavouriteButton, isInternal }) {
    const properties = stilling._source.properties;
    const applicationUrl = getApplicationUrl(stilling._source.source, properties);
    const isFinn = stilling._source.source === "FINN";
    const path = isInternal ? "intern" : "stilling";

    if (properties.hasInterestform === "true") {
        return (
            <section className="JobPosting__section">
                <Heading level="2" size="medium" spacing>
                    Søk på denne stillingen
                </Heading>

                {stilling._source.status === "ACTIVE" && (
                    <BodyShort spacing>Vis frem deg selv og din erfaring med en superrask søknad.</BodyShort>
                )}

                {properties.applicationdue && (
                    <dl className="JobPosting__dl">
                        <dt>Søknadsfrist:</dt>
                        <dd>
                            {isValidISOString(properties.applicationdue)
                                ? formatDate(properties.applicationdue, "DD.MM.YYYY")
                                : properties.applicationdue}
                        </dd>
                    </dl>
                )}

                {stilling._source.status === "ACTIVE" && (
                    <Button
                        as={Link}
                        onClick={() => {
                            logAmplitudeEvent("click superrask søknad link", {
                                id: stilling._id
                            });
                        }}
                        to={`${CONTEXT_PATH}/${path}/${stilling._id}/superrask-soknad`}
                    >
                        Gå til superrask søknad
                    </Button>
                )}

                {!isFinn && properties.applicationemail && (
                    <BodyLong spacing>
                        Alternativt kan du sende søknad via e-post til{" "}
                        {isValidEmail(properties.applicationemail) ? (
                            <a href={`mailto:${properties.applicationemail}`}>{properties.applicationemail}</a>
                        ) : (
                            properties.applicationemail
                        )}
                    </BodyLong>
                )}

                {applicationUrl && (
                    <React.Fragment>
                        {isValidUrl(applicationUrl) ? (
                            <BodyShort spacing>
                                Alternativt kan du{" "}
                                <a href={applicationUrl} onClick={() => applyForPosition(isFinn, stilling)}>
                                    sende søknad her.
                                </a>
                            </BodyShort>
                        ) : (
                            <BodyLong spacing>Alternativt kan du sende søknad på {applicationUrl}.</BodyLong>
                        )}
                    </React.Fragment>
                )}

                {showFavouriteButton && (
                    <FavouritesButton
                        className="HowToApply__favourite-button"
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
            <section className="JobPosting__section">
                <Heading level="2" size="medium" spacing>
                    Søknad
                </Heading>
                <dl className="JobPosting__dl">
                    {properties.applicationdue && (
                        <React.Fragment>
                            <dt>Søknadsfrist:</dt>
                            <dd>
                                {isValidISOString(properties.applicationdue)
                                    ? formatDate(properties.applicationdue, "DD.MM.YYYY")
                                    : properties.applicationdue}
                            </dd>
                        </React.Fragment>
                    )}
                    {!isFinn && properties.applicationemail && (
                        <React.Fragment>
                            <dt>Send søknad til:</dt>
                            <dd>
                                {isValidEmail(properties.applicationemail) ? (
                                    <a href={`mailto:${properties.applicationemail}`}>{properties.applicationemail}</a>
                                ) : (
                                    properties.applicationemail
                                )}
                            </dd>
                        </React.Fragment>
                    )}
                    {applicationUrl && (
                        <React.Fragment>
                            <dt>Søknadslenke:</dt>
                            <dd>
                                {isValidUrl(applicationUrl) ? (
                                    <a href={applicationUrl} onClick={() => applyForPosition(isFinn, stilling)}>
                                        Søk på stillingen
                                    </a>
                                ) : (
                                    applicationUrl
                                )}
                            </dd>
                        </React.Fragment>
                    )}
                </dl>
                {isFinn && (
                    <BodyLong>
                        Denne annonsen er hentet fra FINN.no. Du kan sende søknad via den opprinnelige annonsen.
                    </BodyLong>
                )}
                {showFavouriteButton && (
                    <FavouritesButton
                        className="HowToApply__favourite-button"
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
            properties: PropTypes.shape({
                applicationdue: PropTypes.string,
                applicationemail: PropTypes.string,
                applicationurl: PropTypes.string,
                sourceurl: PropTypes.string,
                hasInterestform: PropTypes.string
            })
        })
    }).isRequired,
    showFavouriteButton: PropTypes.bool.isRequired,
    isInternal: PropTypes.bool.isRequired
};
