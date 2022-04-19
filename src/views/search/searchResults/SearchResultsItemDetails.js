import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import getEmployer from "../../../../server/common/getEmployer";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../environment";
import { formatISOString, isValidISOString } from "../../../components/utils";
import "./SearchResultsItemDetails.less";

function LinkToAd({ children, stilling, isFinn }) {
    if (isFinn) {
        return (
            <a href={`https://www.finn.no/${stilling.reference}`} className="SearchResultItem__link">
                {children}
            </a>
        );
    }
    return (
        <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`} className="SearchResultItem__link">
            {children}
        </Link>
    );
}

export default function SearchResultsItemDetails({ stilling, showExpired }) {
    let frist;
    const { applicationdue } = stilling.properties;
    if (applicationdue && applicationdue !== undefined) {
        frist = isValidISOString(applicationdue) ? formatISOString(applicationdue, "DD.MM.YYYY") : applicationdue;
    } else {
        frist = "Ikke oppgitt";
    }
    const location = getWorkLocation(stilling.properties.location, stilling.locationList);
    const employer = getEmployer(stilling);
    const isFinn = stilling.source && stilling.source.toLowerCase() === "finn";

    return (
        <LinkToAd stilling={stilling} isFinn={isFinn} employer={employer}>
            <div className="SearchResultsItemDetails">
                <h3 className="SearchResultsItemDetails__title" aria-label={`${stilling.title}.`}>
                    {stilling.title}
                </h3>

                {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                    <p className="SearchResultsItemDetails__jobtitle" aria-label={`${stilling.properties.jobtitle}.`}>
                        {stilling.properties.jobtitle}
                    </p>
                )}

                {employer && (
                    <p className="SearchResultsItemDetails__employer" aria-label={`${employer}.`}>
                        {employer}
                    </p>
                )}

                {location && (
                    <p className="SearchResultsItemDetails__location" aria-label={`${location}.`}>
                        {location}
                    </p>
                )}
                <div className="SearchResultsItemDetails__applicationdue-wrapper">
                    <p className="SearchResultsItemDetails__applicationdue" aria-label={`Søknadsfrist: ${frist}.`}>
                        Frist: {frist}
                        {stilling.published && (
                            <span
                                className="SearchResultsItemDetails__published"
                                aria-label={`Publisert ${formatISOString(stilling.published, "DD.MM.YYYY")}.`}
                            >
                                {" - "} Publisert {formatISOString(stilling.published, "DD.MM.YYYY")}
                            </span>
                        )}
                    </p>
                    {isFinn && (
                        <p
                            className="SearchResultsItemDetails__external-link"
                            aria-label={"Annonsen åpnes på finn.no."}
                        >
                            Annonsen åpnes på FINN.no
                        </p>
                    )}
                </div>
                {showExpired && <p className="FavouritesListItem__expired">Annonsen er utløpt</p>}
            </div>
        </LinkToAd>
    );
}

SearchResultsItemDetails.propTypes = {
    stilling: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        published: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string
        }),
        locationList: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};
