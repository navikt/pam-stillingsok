import PropTypes from "prop-types";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import getEmployer from "../../../../server/common/getEmployer";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../environment";
import { formatDate } from "../../../components/utils";
import "./SearchResultsItem.css";
import { Tag } from "@navikt/ds-react";

export default function SearchResultItem({ ad, showExpired, favouriteButton, shouldAutoFocus }) {
    const location = getWorkLocation(ad.properties.location, ad.locationList);
    const employer = getEmployer(ad);
    const isFinn = ad.source && ad.source.toLowerCase() === "finn";
    const published = formatDate(ad.published, "DD.MM.YYYY");
    const jobTitle = ad.properties.jobtitle && ad.title !== ad.properties.jobtitle ? ad.properties.jobtitle : undefined;
    const frist = ad.properties.applicationdue ? formatDate(ad.properties.applicationdue, "DD.MM.YYYY") : undefined;
    const ref = useRef();

    useLayoutEffect(() => {
        if (shouldAutoFocus && ref.current) {
            ref.current.focus();
        }
    }, [shouldAutoFocus]);

    return (
        <article
            ref={ref}
            tabIndex={shouldAutoFocus ? -1 : undefined}
            className="SearchResultItem"
            aria-labelledby={`${ad.uuid}-h3 ${ad.uuid}-jobTitle ${ad.uuid}-employer ${ad.uuid}-location`}
        >
            <h3 className="SearchResultsItem__title" id={`${ad.uuid}-h3`}>
                <LinkToAd stilling={ad} isFinn={isFinn} employer={employer}>
                    {ad.title}
                </LinkToAd>
            </h3>

            {showExpired && (
                <p>
                    <Tag variant="warning" className="SearchResultsItem__expired">
                        Annonsen er utløpt
                    </Tag>
                </p>
            )}

            {jobTitle && (
                <p id={`${ad.uuid}-jobTitle`} className="SearchResultsItem__jobtitle">
                    {jobTitle}
                </p>
            )}
            {employer && (
                <p id={`${ad.uuid}-employer`} className="SearchResultsItem__employer">
                    {employer}
                </p>
            )}
            {location && (
                <p id={`${ad.uuid}-location`} className="SearchResultsItem__location">
                    {location}
                </p>
            )}

            <div className="SearchResultsItem__bottom">
                <div>
                    {frist && <p className="SearchResultsItem__applicationdue">Frist: {frist}</p>}
                    {published && <p className="SearchResultsItem__published">Publisert: {published}</p>}
                    {isFinn && <p className="SearchResultsItem__external-link">Åpnes på FINN.no</p>}
                </div>
                {favouriteButton}
            </div>
        </article>
    );
}

SearchResultItem.defaultProps = {
    shouldAutofocus: false
};

SearchResultItem.propTypes = {
    ad: PropTypes.shape({
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
    }).isRequired,
    shouldAutofocus: PropTypes.bool
};

function LinkToAd({ children, stilling, isFinn }) {
    if (isFinn) {
        return (
            <a href={`https://www.finn.no/${stilling.reference}`} className="link">
                {children}
            </a>
        );
    }
    return (
        <Link to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`} className="link">
            {children}
        </Link>
    );
}
