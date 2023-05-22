import PropTypes from "prop-types";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BodyLong, Heading, Label, Link as AkselLink, Tag } from "@navikt/ds-react";
import { parseISO, endOfDay, subDays, isSameDay, addDays, parse, format as formatDateFns } from "date-fns";
import { Buldings3Icon, ExternalLinkIcon, PinIcon } from "@navikt/aksel-icons";
import getEmployer from "../../../../../server/common/getEmployer";
import getWorkLocation from "../../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../../common/environment";
import { formatDate } from "../../../../common/components/utils";
import "./SearchResultsItem.css";

export default function SearchResultItem({ ad, showExpired, favouriteButton, shouldAutoFocus }) {
    const location = getWorkLocation(ad.properties.location, ad.locationList);
    const employer = getEmployer(ad);
    const isFinn = ad.source && ad.source.toLowerCase() === "finn";
    const published = formatDate(ad.published);
    const now = new Date();
    // Check against end of day to avoid issues.
    const isPublishedToday = isSameDay(endOfDay(now), endOfDay(parseISO(ad.published)));
    const isPublishedYesterday = isSameDay(endOfDay(subDays(now, 1)), endOfDay(parseISO(ad.published)));
    const isPublishedTwoDaysAgo = isSameDay(endOfDay(subDays(now, 2)), endOfDay(parseISO(ad.published)));
    const hasInterestform = ad.properties.hasInterestform && ad.properties.hasInterestform === "true";
    const jobTitle = ad.properties.jobtitle && ad.title !== ad.properties.jobtitle ? ad.properties.jobtitle : undefined;
    const frist = ad.properties.applicationdue ? formatDate(ad.properties.applicationdue) : undefined;
    const ref = useRef();

    useLayoutEffect(() => {
        if (shouldAutoFocus && ref.current) {
            ref.current.focus({ preventScroll: true });
        }
    }, [shouldAutoFocus]);

    const fristText = () => {
        if (frist.toLowerCase().indexOf("asap") > -1) {
            return "Søk snarest mulig";
        }

        if (frist.toLowerCase().indexOf("snarest") > -1) {
            return "Søk snarest mulig";
        }
        try {
            if (endOfDay(now) === endOfDay(parseISO(ad.properties.applicationdue))) {
                return "Søk senest i dag";
            }
            if (endOfDay(addDays(now, 1)) === endOfDay(parseISO(ad.properties.applicationdue))) {
                return "Søk senest i morgen";
            }
            if (endOfDay(addDays(now, 2)) === endOfDay(parseISO(ad.properties.applicationdue))) {
                return "Søk senest i overmorgen";
            }
            return `Søk senest: ${formatDateFns(parseISO(ad.properties.applicationdue), "dd.MM")}`;
        } catch (e) {
            const applicationDue = parse(ad.properties.applicationdue, "dd.MM.yyyy", new Date());
            if (applicationDue != null) {
                return `Søk senest: ${formatDateFns(applicationDue, "dd.MM")}`;
            }
            return `Frist: ${frist}`;
        }
    };

    return (
        <article
            ref={ref}
            tabIndex={shouldAutoFocus ? -1 : undefined}
            className="SearchResultItem"
            aria-labelledby={`${ad.uuid}-h3 ${ad.uuid}-jobTitle ${ad.uuid}-employer ${ad.uuid}-location`}
        >
            <div className="SearchResultItem__details mb-0_5">
                {published && (
                    <Label as="p" size="small" className="SearchResultItem__subtle-text published">
                        {isPublishedToday && "Ny i dag"}
                        {isPublishedYesterday && "Ny i går"}
                        {isPublishedTwoDaysAgo && "Ny for to dager siden"}
                        {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                    </Label>
                )}
            </div>
            <div
                className={
                    jobTitle
                        ? "SearchResultItem__heading-and-favourite mb-0_5"
                        : "SearchResultItem__heading-and-favourite mb-1"
                }
            >
                <Heading level="3" size="small" className="SearchResultsItem__title" id={`${ad.uuid}-h3`}>
                    <LinkToAd stilling={ad} isFinn={isFinn} employer={employer}>
                        {ad.title}
                    </LinkToAd>
                </Heading>
                {favouriteButton}
            </div>

            {jobTitle && (
                <Label as="p" id={`${ad.uuid}-jobTitle`} className="mb-1">
                    {jobTitle}
                </Label>
            )}

            <div className="mb-0_5">
                {employer && (
                    <div className="SearchResultItem__text-and-icon mb-0_25">
                        <div>
                            <Buldings3Icon width="1.5em" height="1.5em" aria-label="Arbeidsgiver" />
                        </div>
                        <BodyLong id={`${ad.uuid}-employer`}>{employer}</BodyLong>
                    </div>
                )}
                {location && (
                    <div className="SearchResultItem__text-and-icon mb-0_25">
                        <div>
                            <PinIcon width="1.5em" height="1.5em" aria-label="Sted" />
                        </div>
                        <BodyLong id={`${ad.uuid}-location`}>{location}</BodyLong>
                    </div>
                )}
            </div>

            <div className="SearchResultItem__details">
                {showExpired && <Tag variant="warning-filled">Annonsen er utløpt</Tag>}
                {hasInterestform && <Tag variant="info-filled">Superrask søknad</Tag>}
                {frist && (
                    <Label as="p" size="small" className="SearchResultItem__subtle-text">
                        {fristText()}
                    </Label>
                )}
            </div>
        </article>
    );
}

SearchResultItem.defaultProps = {
    shouldAutoFocus: false,
};

SearchResultItem.propTypes = {
    ad: PropTypes.shape({
        uuid: PropTypes.string,
        source: PropTypes.string,
        title: PropTypes.string,
        published: PropTypes.string,
        properties: PropTypes.shape({
            employer: PropTypes.string,
            hasInterestform: PropTypes.bool,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string,
        }),
        locationList: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    shouldAutoFocus: PropTypes.bool,
    showExpired: PropTypes.bool,
    favouriteButton: PropTypes.node,
};

function LinkToAd({ children, stilling, isFinn }) {
    if (isFinn) {
        return (
            <AkselLink href={`https://www.finn.no/${stilling.reference}`}>
                <span className="SearchResultsItem__title-external">
                    {children} <ExternalLinkIcon width="1.125em" height="1.125em" aria-label="Åpnes på Finn" />
                </span>
            </AkselLink>
        );
    }
    return (
        <AkselLink as={Link} to={`${CONTEXT_PATH}/stilling/${stilling.uuid}`}>
            {children}
        </AkselLink>
    );
}

LinkToAd.propTypes = {
    children: PropTypes.node,
    isFinn: PropTypes.bool,
    stilling: PropTypes.shape({
        reference: PropTypes.string,
        uuid: PropTypes.string,
    }),
};
