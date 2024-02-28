import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Heading, HStack, Link as AkselLink, Tag, VStack } from "@navikt/ds-react";
import { addDays, endOfDay, format as formatDateFns, isSameDay, isValid, parse, parseISO, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import { Buldings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import getEmployer from "@/app/_common/utils/getEmployer";
import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import { formatDate } from "@/app/_common/utils/utils";
import Debug from "./Debug";

export default function SearchResultItem({ ad, showExpired, favouriteButton, isDebug }) {
    const location = getWorkLocation(ad.properties.location, ad.locationList);
    const employer = getEmployer(ad);
    const published = formatDate(ad.published);
    const hasInterestform = ad.properties.hasInterestform && ad.properties.hasInterestform === "true";
    const jobTitle = ad.properties.jobtitle && ad.title !== ad.properties.jobtitle ? ad.properties.jobtitle : undefined;
    const frist = ad.properties.applicationdue ? formatDate(ad.properties.applicationdue) : undefined;

    const now = new Date();
    const isPublishedToday = isSameDay(endOfDay(now), endOfDay(parseISO(ad.published)));
    const isPublishedYesterday = isSameDay(endOfDay(subDays(now, 1)), endOfDay(parseISO(ad.published)));
    const isPublishedTwoDaysAgo = isSameDay(endOfDay(subDays(now, 2)), endOfDay(parseISO(ad.published)));

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
        <HStack
            gap="3"
            justify="space-between"
            wrap={false}
            as="article"
            aria-label={`${ad.title}, ${employer}, ${location}`}
        >
            <VStack gap="3">
                <VStack gap="1">
                    {published && (
                        <BodyShort weight="semibold" size="small" textColor="subtle">
                            {isPublishedToday && "Ny i dag"}
                            {isPublishedYesterday && "I går"}
                            {isPublishedTwoDaysAgo && "To dager siden"}
                            {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                        </BodyShort>
                    )}

                    <HStack gap="2" wrap={false} align="center" justify="space-between">
                        <Heading level="3" size="small" className="overflow-wrap-anywhere">
                            <LinkToAd stilling={ad} employer={employer}>
                                {ad.title}
                            </LinkToAd>
                        </Heading>
                    </HStack>

                    {jobTitle && (
                        <BodyShort weight="semibold" className="overflow-wrap-anywhere">
                            {jobTitle}
                        </BodyShort>
                    )}
                </VStack>

                <VStack gap="1">
                    {employer && (
                        <HStack gap="2" wrap={false} align="center">
                            <VStack align="center">
                                <Buldings3Icon width="1.5em" height="1.5em" aria-hidden="true" />
                                <BodyShort visuallyHidden>Arbeidsgiver</BodyShort>
                            </VStack>
                            <BodyShort className="overflow-wrap-anywhere">{employer}</BodyShort>
                        </HStack>
                    )}
                    {location && (
                        <HStack gap="2" wrap={false} align="center">
                            <VStack align="center">
                                <LocationPinIcon width="1.5em" height="1.5em" aria-label="Sted" aria-hidden="true" />
                                <BodyShort visuallyHidden>Sted</BodyShort>
                            </VStack>
                            <BodyShort className="overflow-wrap-anywhere">{location}</BodyShort>
                        </HStack>
                    )}
                </VStack>

                <HStack gap="4" align="center">
                    {showExpired && <Tag variant="warning-moderate">Annonsen er utløpt</Tag>}
                    {hasInterestform && <Tag variant="info-moderate">Superrask søknad</Tag>}
                    {frist && (
                        <BodyShort weight="semibold" size="small" textColor="subtle">
                            {fristText()}
                        </BodyShort>
                    )}
                </HStack>

                {isDebug && <Debug ad={ad} />}
            </VStack>
            <div className="mt-4">{favouriteButton}</div>
        </HStack>
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

function LinkToAd({ children, stilling }) {
    return (
        <AkselLink as={Link} href={`/stilling/${stilling.uuid}`}>
            {children}
        </AkselLink>
    );
}

LinkToAd.propTypes = {
    children: PropTypes.node,
    stilling: PropTypes.shape({
        reference: PropTypes.string,
        uuid: PropTypes.string,
    }),
};
