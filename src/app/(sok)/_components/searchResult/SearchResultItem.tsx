import React, { ReactElement, ReactNode } from "react";
import { BodyShort, Heading, HStack, Link as AkselLink, Tag, VStack } from "@navikt/ds-react";
import { endOfDay, isSameDay, parseISO, subDays } from "date-fns";
import { Buldings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import getEmployer from "@/app/_common/utils/getEmployer";
import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import { formatDate } from "@/app/_common/utils/utils";
import deadlineText from "@/app/_common/utils/deadlineText";
import { SearchResultAd } from "@/app/(sok)/_types/SearchResult";
import Debug from "./Debug";

interface SearchResultItemProps {
    ad: SearchResultAd;
    showExpired: boolean;
    favouriteButton: ReactNode;
    isDebug: boolean;
}

export default function SearchResultItem({
    ad,
    showExpired,
    favouriteButton,
    isDebug,
}: SearchResultItemProps): ReactElement {
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
                        <BodyShort weight="semibold" size="small" textColor="subtle" suppressHydrationWarning>
                            {isPublishedToday && "Ny i dag"}
                            {isPublishedYesterday && "I går"}
                            {isPublishedTwoDaysAgo && "To dager siden"}
                            {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                        </BodyShort>
                    )}
                    <HStack gap="2" wrap={false} align="center" justify="space-between">
                        <Heading level="2" size="small" className="overflow-wrap-anywhere">
                            <AkselLink
                                className="purple-when-visited"
                                as={Link}
                                href={`/stilling/${ad.uuid}`}
                                prefetch={false}
                            >
                                {ad.title}
                            </AkselLink>
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
                                <Buldings3Icon fontSize="1.5rem" aria-hidden="true" />
                                <BodyShort visuallyHidden>Arbeidsgiver</BodyShort>
                            </VStack>
                            <BodyShort className="overflow-wrap-anywhere">{employer}</BodyShort>
                        </HStack>
                    )}
                    {location && (
                        <HStack gap="2" wrap={false} align="center">
                            <VStack align="center">
                                <LocationPinIcon fontSize="1.5rem" aria-label="Sted" aria-hidden="true" />
                                <BodyShort visuallyHidden>Sted</BodyShort>
                            </VStack>
                            <BodyShort className="overflow-wrap-anywhere">{location}</BodyShort>
                        </HStack>
                    )}
                </VStack>

                <HStack gap="4" align="center">
                    {showExpired && (
                        <Tag size="small" variant="warning-moderate">
                            Annonsen er utløpt
                        </Tag>
                    )}
                    {hasInterestform && (
                        <Tag size="small" variant="info-moderate">
                            Superrask søknad
                        </Tag>
                    )}
                    {frist && (
                        <BodyShort weight="semibold" size="small" textColor="subtle" suppressHydrationWarning>
                            {deadlineText(frist, now, ad.properties.applicationdue)}
                        </BodyShort>
                    )}
                </HStack>

                {isDebug && <Debug ad={ad} />}
            </VStack>
            <div className="mt-4">{favouriteButton}</div>
        </HStack>
    );
}