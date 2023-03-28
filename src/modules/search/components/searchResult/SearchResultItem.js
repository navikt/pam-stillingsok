import PropTypes from "prop-types";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BodyShort, Heading, Label, Tag } from "@navikt/ds-react";
import getEmployer from "../../../../../server/common/getEmployer";
import getWorkLocation from "../../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../../common/environment";
import { formatDate } from "../../../../common/components/utils";
import "./SearchResultsItem.css";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link as AkselLink } from "@navikt/ds-react";

export default function SearchResultItem({ ad, showExpired, favouriteButton, shouldAutoFocus }) {
    const location = getWorkLocation(ad.properties.location, ad.locationList);
    const employer = getEmployer(ad);
    const isFinn = ad.source && ad.source.toLowerCase() === "finn";
    const published = formatDate(ad.published, "DD.MM.YYYY");
    const hasInterestform = ad.properties.hasInterestform && ad.properties.hasInterestform === "true";
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
            <Heading level="3" size="small" className="SearchResultsItem__title" id={`${ad.uuid}-h3`}>
                <LinkToAd stilling={ad} isFinn={isFinn} employer={employer}>
                    {ad.title}
                </LinkToAd>
            </Heading>

            {showExpired && (
                <Tag variant="warning-filled" className="mb-1">
                    Annonsen er utløpt
                </Tag>
            )}

            {jobTitle && (
                <Label as="p" id={`${ad.uuid}-jobTitle`} className="SearchResultsItem__jobtitle">
                    {jobTitle}
                </Label>
            )}
            {employer && (
                <BodyShort id={`${ad.uuid}-employer`} className="SearchResultsItem__employer">
                    {employer}
                </BodyShort>
            )}
            {location && (
                <BodyShort id={`${ad.uuid}-location`} className="SearchResultsItem__location">
                    {location}
                </BodyShort>
            )}

            <div className="SearchResultsItem__bottom">
                <div>
                    {frist && (
                        <BodyShort size="small" className="SearchResultsItem__applicationdue mb-0_25">
                            Frist: {frist}
                        </BodyShort>
                    )}
                    {published && (
                        <BodyShort size="small" className="SearchResultsItem__published">
                            Publisert: {published}
                        </BodyShort>
                    )}
                    {hasInterestform && (
                        <Tag size="small" variant="info-filled" className="mt-1">
                            Superrask søknad
                        </Tag>
                    )}
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
            <AkselLink href={`https://www.finn.no/${stilling.reference}`}>
                {children} <ExternalLinkIcon width="1.25em" height="1.25em" aria-label="Åpnes på Finn" />
            </AkselLink>
        );
    }
    return (
        <AkselLink as={Link} to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`}>
            {children}
        </AkselLink>
    );
}
