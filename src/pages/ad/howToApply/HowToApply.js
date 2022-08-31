import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import { formatDate, isValidEmail, isValidISOString, isValidUrl } from "../../../components/utils";
import "./HowToApply.less";
import logAmplitudeEvent from "../../../tracking/amplitude";
import FavouritesButton from "../../favourites/FavouritesButton";
import CalendarIcon from "../../../components/icons/CalendarIcon";
import InterestAPI from "../../../api/InterestAPI";
import {CONTEXT_PATH} from "../../../environment";

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
    const applicationUrl = getApplicationUrl(stilling._source.source, properties);
    const isFinn = stilling._source.source === "FINN";

    if(InterestAPI.shouldEnableInterestFeature(stilling._id)) {
        return (
            <section className="JobPosting__section">
                <h2 className="JobPosting__h2">
                    Meld din interesse
                </h2>
                <p className="JobPosting__p">
                    Gi beskjed til bedriften at du ønsker å bli kontaktet for denne stillingen.
                </p>
                <Link className="Knapp Knapp--hoved" to={`${CONTEXT_PATH}/stilling/${stilling._id}/meld-interesse`}>
                    Meld din interesse
                </Link>
                {showFavouriteButton && (
                    <FavouritesButton
                        className="HowToApply__favourite-button"
                        type="knapp"
                        id={stilling._id}
                        stilling={stilling._source}
                    />
                )}
            </section>
        )
    }

    if (properties.applicationdue || properties.applicationemail || applicationUrl) {
        return (
            <section className="JobPosting__section">
                <h2 className="JobPosting__h2">
                    <CalendarIcon />
                    Søknad
                </h2>
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
                                    <a className="link" href={`mailto:${properties.applicationemail}`}>
                                        {properties.applicationemail}
                                    </a>
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
                                    <a
                                        href={applicationUrl}
                                        onClick={() => applyForPosition(isFinn, stilling)}
                                        className="link"
                                    >
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
                    <p>Denne annonsen er hentet fra FINN.no. Du kan sende søknad via den opprinnelige annonsen.</p>
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
