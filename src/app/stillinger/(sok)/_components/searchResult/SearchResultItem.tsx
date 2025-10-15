import React, { ReactElement } from "react";
import { BodyShort, Heading, HStack, Link as AkselLink, Tag, VStack } from "@navikt/ds-react";
import { endOfDay, isSameDay, parseISO, subDays } from "date-fns";
import { Buildings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";
import Debug from "./Debug";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { KLIKK_ANNONSE } from "@/app/_common/umami/constants";
import { track } from "@/app/_common/umami";

interface SearchResultItemProps {
    ad: Partial<StillingSoekElement>;
    showExpired?: boolean;
    favouriteButton: React.ReactNode;
    isDebug: boolean;
    favoriteLocation?: string;
    isFavourites: boolean;
    position?: number;
    fromSimilaritySearch?: boolean;
}

export default function SearchResultItem({
    ad,
    showExpired,
    favouriteButton,
    isDebug,
    favoriteLocation,
    isFavourites,
    position = -1,
    fromSimilaritySearch = false,
}: SearchResultItemProps): ReactElement {
    const location = favoriteLocation ? favoriteLocation : getWorkLocation(undefined, ad.locationList);
    const employer = ad.employer?.name;
    const published = formatDate(ad.published);
    const hasSuperraskSoknad = ad.hasSuperraskSoknad && ad.hasSuperraskSoknad === "true";
    const jobTitle = ad?.jobTitle && ad.title !== ad.jobTitle ? ad.jobTitle : undefined;
    const frist = ad.applicationDue ? formatDate(ad.applicationDue) : undefined;
    const now = new Date();
    const isPublishedToday = ad.published !== undefined && isSameDay(endOfDay(now), endOfDay(parseISO(ad.published)));
    const isPublishedYesterday =
        ad.published !== undefined && isSameDay(endOfDay(subDays(now, 1)), endOfDay(parseISO(ad.published)));
    const isPublishedTwoDaysAgo =
        ad.published !== undefined && isSameDay(endOfDay(subDays(now, 2)), endOfDay(parseISO(ad.published)));

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
                    {published && !isFavourites && (
                        <BodyShort weight="semibold" size="small" textColor="subtle" suppressHydrationWarning>
                            {isPublishedToday && "Ny i dag"}
                            {isPublishedYesterday && "I går"}
                            {isPublishedTwoDaysAgo && "To dager siden"}
                            {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                        </BodyShort>
                    )}
                    <HStack gap="2" wrap={false} align="center" justify="space-between">
                        <Heading level="2" size="small" className="overflow-wrap-anywhere">
                            <LinkToAd stilling={ad} position={position} fromSimilaritySearch={fromSimilaritySearch}>
                                {ad.title || ""}
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
                                <Buildings3Icon fontSize="1.5rem" aria-hidden="true" />
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
                    {hasSuperraskSoknad && (
                        <Tag size="small" variant="info-moderate">
                            Superrask søknad
                        </Tag>
                    )}
                    {frist && ad.applicationDue && !showExpired && (
                        <BodyShort weight="semibold" size="small" textColor="subtle" suppressHydrationWarning>
                            {deadlineText(frist, now, ad.applicationDue)}
                        </BodyShort>
                    )}
                </HStack>

                {isDebug && <Debug ad={ad} />}
            </VStack>
            <div className="mt-4">{favouriteButton}</div>
        </HStack>
    );
}

interface LinkToAdProps {
    children: ReactElement | string;
    stilling: Partial<StillingSoekElement>;
    position?: number;
    fromSimilaritySearch?: boolean;
}

function LinkToAd({ children, stilling, position, fromSimilaritySearch }: LinkToAdProps): ReactElement {
    return (
        <AkselLink
            className="purple-when-visited"
            as={Link}
            href={`/stillinger/stilling/${stilling.uuid}`}
            prefetch={false}
            onClick={() => {
                if (fromSimilaritySearch) {
                    track("Lignende annonser - klikk", {
                        adid: stilling.uuid || "",
                        position: position,
                        title: stilling.title || "",
                        jobTitle: stilling.jobTitle || "",
                        employer: stilling.employer?.name || "",
                        location: getWorkLocation(undefined, stilling.locationList) || "",
                        href: `/stillinger/stilling/${stilling.uuid}`,
                    });
                } else {
                    umamiTracking(KLIKK_ANNONSE, {
                        adid: stilling.uuid || "",
                        title: stilling.title || "",
                        href: `/stillinger/stilling/${stilling.uuid}`,
                    });
                }
            }}
        >
            {children}
        </AkselLink>
    );
}
