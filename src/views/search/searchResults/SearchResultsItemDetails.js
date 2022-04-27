import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import getEmployer from "../../../../server/common/getEmployer";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../environment";
import { formatISOString, isValidISOString } from "../../../components/utils";
import "./SearchResultsItemDetails.less";
import Tag from "../../../components/tag/Tag";

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
        <React.Fragment>
            <h3 className="SearchResultsItemDetails__title">
                <LinkToAd stilling={stilling} isFinn={isFinn} employer={employer}>
                    {stilling.title}
                </LinkToAd>
            </h3>

            {stilling.properties.jobtitle && stilling.title !== stilling.properties.jobtitle && (
                <p className="SearchResultsItemDetails__jobtitle">{stilling.properties.jobtitle}</p>
            )}

            {employer && <p className="SearchResultsItemDetails__employer">{employer}</p>}

            {location && <p className="SearchResultsItemDetails__location">{location}</p>}
            <div className="SearchResultsItemDetails__applicationdue-wrapper">
                <p className="SearchResultsItemDetails__applicationdue">
                    Frist: {frist}
                    {stilling.published && (
                        <React.Fragment>
                            {" - "} Publisert {formatISOString(stilling.published, "DD.MM.YYYY")}
                        </React.Fragment>
                    )}
                </p>
                {isFinn && <p className="SearchResultsItemDetails__external-link">Annonsen åpnes på FINN.no</p>}
            </div>
            {showExpired && <Tag className="FavouritesListItem__expired">Annonsen er utløpt</Tag>}
        </React.Fragment>
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
