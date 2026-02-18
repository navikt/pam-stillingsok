import React, { ReactElement } from "react";
import { BodyShort, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import { endOfDay, isSameDay, parseISO, subDays } from "date-fns";
import { Buildings3Icon, LocationPinIcon } from "@navikt/aksel-icons";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import { type StillingSoekElement } from "@/server/schemas/stillingSearchSchema";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { KLIKK_MULIGHET } from "@/app/_common/umami/constants";
import type { Location } from "@/app/stillinger/_common/lib/ad-model";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";

type InternalSearchResultItemProps = {
    ad: Partial<StillingSoekElement>;
    showExpired?: boolean;
};

export default function InternalSearchResultItem({ ad, showExpired }: InternalSearchResultItemProps): ReactElement {
    const location = getWorkLocation(ad.locationList as Location[]);
    const employer = ad.employer?.name;
    const published = formatDate(ad.published);
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
            gap="space-12"
            justify="space-between"
            wrap={false}
            as="article"
            aria-label={`${ad.title}, ${employer}, ${location}`}
        >
            <VStack gap="space-12">
                <VStack gap="space-4">
                    {published && (
                        <BodyShort weight="semibold" size="small" textColor="subtle" suppressHydrationWarning>
                            {isPublishedToday && "Ny i dag"}
                            {isPublishedYesterday && "I går"}
                            {isPublishedTwoDaysAgo && "To dager siden"}
                            {!isPublishedToday && !isPublishedYesterday && !isPublishedTwoDaysAgo && published}
                        </BodyShort>
                    )}
                    <HStack gap="space-8" wrap={false} align="center" justify="space-between">
                        <Heading level="2" size="small" className="overflow-wrap-anywhere">
                            <LinkToInternalAd mulighet={ad}>{ad.title || ""}</LinkToInternalAd>
                        </Heading>
                    </HStack>
                    {jobTitle && (
                        <BodyShort weight="semibold" className="overflow-wrap-anywhere">
                            {jobTitle}
                        </BodyShort>
                    )}
                </VStack>

                <VStack gap="space-4">
                    {employer && (
                        <HStack gap="space-8" wrap={false} align="center">
                            <VStack align="center">
                                <Buildings3Icon fontSize="1.5rem" aria-hidden="true" />
                                <BodyShort visuallyHidden>Arbeidsgiver</BodyShort>
                            </VStack>
                            <BodyShort className="overflow-wrap-anywhere">{employer}</BodyShort>
                        </HStack>
                    )}
                    {location && (
                        <HStack gap="space-8" wrap={false} align="center">
                            <VStack align="center">
                                <LocationPinIcon fontSize="1.5rem" aria-label="Sted" aria-hidden="true" />
                                <BodyShort visuallyHidden>Sted</BodyShort>
                            </VStack>
                            <BodyShort className="overflow-wrap-anywhere">{location}</BodyShort>
                        </HStack>
                    )}
                </VStack>

                <HStack gap="space-16" align="center">
                    <Tag size="small" variant="success-moderate">
                        Mulighet
                    </Tag>

                    {showExpired && (
                        <Tag size="small" variant="warning-moderate">
                            Annonsen er utløpt
                        </Tag>
                    )}
                    {frist && ad.applicationDue && !showExpired && (
                        <BodyShort weight="semibold" size="small" textColor="subtle" suppressHydrationWarning>
                            {deadlineText(frist, now, ad.applicationDue)}
                        </BodyShort>
                    )}
                </HStack>
            </VStack>
        </HStack>
    );
}

type LinkToInternalAdProps = {
    children: ReactElement | string;
    mulighet: Partial<StillingSoekElement>;
};

function LinkToInternalAd({ children, mulighet }: LinkToInternalAdProps): ReactElement {
    return (
        <AkselNextLink
            className="purple-when-visited"
            href={`/muligheter/mulighet/${mulighet.uuid}`}
            prefetch={false}
            onClick={() =>
                umamiTracking(KLIKK_MULIGHET, {
                    adid: mulighet.uuid || "",
                    title: mulighet.title || "",
                    href: `/muligheter/mulighet/${mulighet.uuid}`,
                })
            }
        >
            {children}
        </AkselNextLink>
    );
}
