import PropTypes from "prop-types";
import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BodyLong, BodyShort, Heading, HStack, Link as AkselLink, Tag } from "@navikt/ds-react";
import { addDays, endOfDay, format as formatDateFns, isSameDay, isValid, parse, parseISO, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { Buldings3Icon, ExternalLinkIcon, PinIcon } from "@navikt/aksel-icons";
import getEmployer from "../../../../../server/common/getEmployer";
import getWorkLocation from "../../../../../server/common/getWorkLocation";
import { CONTEXT_PATH } from "../../../common/environment";
import { formatDate } from "../../../common/utils/utils";
import Debug from "./Debug";

export default function SearchResultItem({ ad, showExpired, favouriteButton, isDebug, shouldAutoFocus = false }) {
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
            className="mb-12"
            aria-labelledby={`${ad.uuid}-h3 ${ad.uuid}-jobTitle ${ad.uuid}-employer ${ad.uuid}-location`}
        >
            {published && (
                <BodyLong weight="semibold" size="small" textColor="subtle">
                    {isPublishedToday && "Ny i dag"}
                    {isPublishedYesterday && "I går"}
                    {isPublishedTwoDaysAgo && "To dager siden"}
                    {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                </BodyLong>
            )}

            <HStack gap="2" wrap={false} align="center" justify="space-between" className="mb-2">
                <Heading level="3" size="small" className="overflow-wrap-anywhere" id={`${ad.uuid}-h3`}>
                    <LinkToAd stilling={ad} isFinn={isFinn} employer={employer}>
                        {ad.title}
                    </LinkToAd>
                </Heading>
                {favouriteButton}
            </HStack>

            {jobTitle && (
                <BodyLong weight="semibold" id={`${ad.uuid}-jobTitle`} className="mb-4 overflow-wrap-anywhere">
                    {jobTitle}
                </BodyLong>
            )}

            <div className="mb-2">
                {employer && (
                    <HStack gap="2" className="mb-1">
                        <div>
                            <Buldings3Icon width="1.5em" height="1.5em" aria-hidden="true" />
                            <BodyShort visuallyHidden>Arbeidsgiver</BodyShort>
                        </div>
                        <BodyLong id={`${ad.uuid}-employer`} className="overflow-wrap-anywhere">
                            {employer}
                        </BodyLong>
                    </HStack>
                )}
                {location && (
                    <HStack gap="2" className="mb-1">
                        <div>
                            <PinIcon width="1.5em" height="1.5em" aria-label="Sted" aria-hidden="true" />
                            <BodyShort visuallyHidden>Sted</BodyShort>
                        </div>
                        <BodyLong id={`${ad.uuid}-location`} className="overflow-wrap-anywhere">
                            {location}
                        </BodyLong>
                    </HStack>
                )}
            </div>

            <HStack gap="4" align="center">
                {showExpired && <Tag variant="warning-moderate">Annonsen er utløpt</Tag>}
                {hasInterestform && <Tag variant="info-moderate">Superrask søknad</Tag>}
                {frist && (
                    <BodyLong weight="semibold" size="small" textColor="subtle">
                        {fristText()}
                    </BodyLong>
                )}
            </HStack>

            {isDebug && <Debug ad={ad} />}
        </article>
    );
}

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
    isDebug: PropTypes.bool,
};

function LinkToAd({ children, stilling, isFinn }) {
    if (isFinn) {
        return (
            <AkselLink href={`https://www.finn.no/${stilling.reference}`}>
                {children} <ExternalLinkIcon width="1.125em" height="1.125em" aria-label="Åpnes på Finn" />
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
