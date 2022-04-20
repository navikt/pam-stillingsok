import React from "react";
import PropTypes from "prop-types";
import { formatISOString, isValidEmail, isValidISOString, isValidUrl } from "../../../components/utils";
import "./HowToApply.less";
import logAmplitudeEvent from "../../../api/amplitude/amplitude";
import FavouritesButton from "../../favourites/FavouritesButton";

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
            <div className="HowToApply detail-section">
                <h2 className="HowToApply__head detail-section__head">
                    <svg
                        aria-hidden="true"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        focusable="false"
                        role="img"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6 7V5H2v5h20V5h-4v2a1 1 0 11-2 0V5H8v2a1 1 0 11-2 0zm10-4H8V1a1 1 0 10-2 0v2H2a2 2 0 00-2 2v17a2 2 0 002 2h20a2 2 0 002-2V5a2 2 0 00-2-2h-4V1a1 1 0 10-2 0v2zM2 12v10h20V12H2zm6 3a1 1 0 00-1-1H5a1 1 0 100 2h2a1 1 0 001-1zm-1 3a1 1 0 110 2H5a1 1 0 110-2h2zm6-4h-2a1 1 0 100 2h2a1 1 0 100-2zm-2 4h2a1 1 0 110 2h-2a1 1 0 110-2zm9-3a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1zm-4 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                            fill="currentColor"
                        ></path>
                    </svg>
                    <span>Søknad</span>
                </h2>
                <div className="detail-section__body">
                    <dl className="dl-flex typo-normal">
                        {properties.applicationdue && [
                            <dt key="dt">Søknadsfrist:</dt>,
                            <dd key="dd">
                                {isValidISOString(properties.applicationdue)
                                    ? formatISOString(properties.applicationdue, "DD.MM.YYYY")
                                    : properties.applicationdue}
                            </dd>
                        ]}
                        {!finn &&
                            properties.applicationemail && [
                                <dt key="dt">Send søknad til:</dt>,
                                <dd key="dd">
                                    {isValidEmail(properties.applicationemail) ? (
                                        <a className="link" href={`mailto:${properties.applicationemail}`}>
                                            {properties.applicationemail}
                                        </a>
                                    ) : (
                                        properties.applicationemail
                                    )}
                                </dd>
                            ]}
                        {sokUrl && !isValidUrl(sokUrl) && [<dt key="dt">Søknadslenke:</dt>, <dd key="dd">{sokUrl}</dd>]}
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
                </div>
            </div>
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
