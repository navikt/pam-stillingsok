import PropTypes from "prop-types";
import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { BodyLong, Heading, Label, Link as AkselLink, Tag } from "@navikt/ds-react";
import { parseISO, endOfDay, subDays, isSameDay, addDays, parse, format as formatDateFns, isValid } from "date-fns";
import { nb } from "date-fns/locale";
import { Buldings3Icon, ExternalLinkIcon, PinIcon } from "@navikt/aksel-icons";
import getEmployer from "../../../../../server/common/getEmployer";
import getWorkLocation from "../../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../common/environment";
import { formatDate } from "../../../common/utils/utils";
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
            let dueDateParsed = parseISO(ad.properties.applicationdue);
            if (!isValid(dueDateParsed)) {
                dueDateParsed = parse(ad.properties.applicationdue, "dd.MM.yyyy", new Date());
            }

            if (!isValid(dueDateParsed)) {
                return `Frist: ${frist}`;
            }

            if (isSameDay(now, dueDateParsed)) {
                return "Søk senest i dag";
            }
            if (isSameDay(addDays(now, 1), dueDateParsed)) {
                return "Søk senest i morgen";
            }
            if (isSameDay(addDays(now, 2), dueDateParsed)) {
                return "Søk senest i overmorgen";
            }
            return `Søk senest ${formatDateFns(dueDateParsed, "EEEE d. MMMM", {
                locale: nb,
            })}`;
        } catch (e) {
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
            <div className="SearchResultItem__details mb-2">
                {published && (
                    <Label as="p" size="small" className="SearchResultItem__subtle-text published">
                        {isPublishedToday && "Ny i dag"}
                        {isPublishedYesterday && "I går"}
                        {isPublishedTwoDaysAgo && "To dager siden"}
                        {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                    </Label>
                )}
            </div>
            <div
                className={
                    jobTitle
                        ? "SearchResultItem__heading-and-favourite mb-2"
                        : "SearchResultItem__heading-and-favourite mb-4"
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
                <Label as="p" id={`${ad.uuid}-jobTitle`} className="mb-4 break-word">
                    {jobTitle}
                </Label>
            )}

            <div className="mb-2">
                {employer && (
                    <div className="SearchResultItem__text-and-icon mb-1">
                        <div>
                            <Buldings3Icon width="1.5em" height="1.5em" aria-label="Arbeidsgiver" />
                        </div>
                        <BodyLong id={`${ad.uuid}-employer`}>{employer}</BodyLong>
                    </div>
                )}
                {location && (
                    <div className="SearchResultItem__text-and-icon mb-1">
                        <div>
                            <PinIcon width="1.5em" height="1.5em" aria-label="Sted" />
                        </div>
                        <BodyLong id={`${ad.uuid}-location`}>{location}</BodyLong>
                    </div>
                )}
            </div>

            <div className="SearchResultItem__details">
                {showExpired && <Tag variant="warning-moderate">Annonsen er utløpt</Tag>}
                {hasInterestform && <Tag variant="info-moderate">Superrask søknad</Tag>}
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
            hasInterestform: PropTypes.string,
            jobtitle: PropTypes.string,
            location: PropTypes.string,
            applicationdue: PropTypes.string,
        }),
        locationList: PropTypes.arrayOf(PropTypes.shape({})),
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
        <AkselLink as={Link} href={`${CONTEXT_PATH}/stilling/${stilling.uuid}`}>
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
