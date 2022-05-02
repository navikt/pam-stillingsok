import React from "react";
import PropTypes from "prop-types";
import { formatDate, isValidEmail, isValidISOString, isValidUrl } from "../../../components/utils";
import "./HowToApply.less";
import logAmplitudeEvent from "../../../tracking/amplitude";
import FavouritesButton from "../../favourites/FavouritesButton";
import CalendarIcon from "../../../components/icons/CalendarIcon";

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

export default function HowToApply({ stilling, showFavouriteButton }) {
    const properties = stilling._source.properties;
    const sokUrl = getApplicationUrl(stilling._source.source, properties);
    const finn = stilling._source.source === "FINN";
    if (properties.applicationdue || properties.applicationemail || sokUrl) {
        return (
            <section className="detail-section">
                <h2 className="detail-section__head">
                    <CalendarIcon />
                    <span>Søknad</span>
                </h2>
                <dl className="dl-flex">
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
                    {!finn && properties.applicationemail && (
                        <React.Fragment>
                            <dt>Send søknad til:</dt>
                            <dd>
                                {isValidEmail(properties.applicationemail) ? (
                                    <a className="link" href={`mailto:${properties.applicationemail}`}>
                                        {properties.applicationemail}
                                    </a>
                                ) : (
                                    properties.applicationemail
                                )}
                            </dd>
                        </React.Fragment>
                    )}
                    {sokUrl && !isValidUrl(sokUrl) && (
                        <React.Fragment>
                            <dt>Søknadslenke:</dt>
                            <dd>{sokUrl}</dd>
                            <dd>{sokUrl}</dd>
                        </React.Fragment>
                    )}
                </dl>
                {finn && (
                    <p className="blokk-xs">
                        {" "}
                        Denne annonsen er hentet fra{" "}
                        <a href="https://www.finn.no" className="link">
                            FINN.no
                        </a>
                        . Du kan sende søknad via den opprinnelige annonsen.
                    </p>
                )}
                {sokUrl && isValidUrl(sokUrl) && (
                    <div className="HowToApply__send-button-wrapper">
                        <a
                            href={sokUrl}
                            onClick={() => applyForPosition(finn, stilling)}
                            className="HowToApply__send-button Knapp Knapp--hoved"
                        >
                            <div className="HowToApply__send-button-content">
                                <span className="HowToApply__send-button-icon" />
                                Søk på stillingen
                            </div>
                        </a>
                    </div>
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
                sourceurl: PropTypes.string
            })
        })
    }).isRequired,
    showFavouriteButton: PropTypes.bool.isRequired
};
