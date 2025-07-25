import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import Employer from "@/app/sommerjobb/_components/icons/Employer";
import Location from "@/app/sommerjobb/_components/icons/Location";
import Calendar from "@/app/sommerjobb/_components/icons/Calendar";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";
import Link from "next/link";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import DebugItem from "@/app/sommerjobb/_components/DebugItem";
import useIsDebug from "@/app/_common/debug-provider/IsDebugProvider";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { SOMMERJOBB_KLIKK_ANNONSE } from "@/app/_common/umami/constants";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    const deadline = sommerjobbAd.applicationDue ? formatDate(sommerjobbAd.applicationDue) : undefined;
    let location = sommerjobbAd.location;
    const employerName = sommerjobbAd.employer.name;
    const ariaLabel = [sommerjobbAd.title, employerName, location].join(", ");
    const { isDebug } = useIsDebug();

    const fjernTags = (str: string) => {
        if (!str) return "";
        return str
            .replace(/(<([^>]+)>)|&nbsp;/gi, " ")
            .replace(/&amp;/g, "&")
            .trim();
    };

    let description = fjernTags(sommerjobbAd.description);

    if (description && description.length > 185) {
        description = description.substring(0, 185).concat("...");
    }

    if (location && location.split(", ").length > 3) {
        location = location.split(", ").splice(0, 3).join(", ").concat(" m.fl.");
    }

    return (
        <Box as="article" shadow="small" background="surface-default" borderRadius="small">
            <HStack
                justify="space-between"
                wrap={false}
                gap="5"
                as={Link}
                aria-label={ariaLabel}
                className="custom-link-panel"
                href={`/stillinger/stilling/${sommerjobbAd.uuid}`}
                onClick={() => {
                    umamiTracking(SOMMERJOBB_KLIKK_ANNONSE, {
                        title: sommerjobbAd.title,
                        href: `/stillinger/stilling/${sommerjobbAd.uuid}`,
                    });
                }}
            >
                <div className="min-width">
                    <Heading className="link mb-1 overflow-wrap-anywhere" size="small" level="3">
                        {sommerjobbAd.title}
                    </Heading>

                    <BodyShort spacing>{description}</BodyShort>

                    <HStack>
                        {employerName && (
                            <HStack className="margin-right mb-2 min-width" gap="2" wrap={false}>
                                <Employer />
                                <BodyShort size="small" className="text-overflow">
                                    <span className="sr-only">Arbeidsgiver</span> {employerName}
                                </BodyShort>
                            </HStack>
                        )}
                        {location && (
                            <HStack gap="2" className="mb-2" align="center" wrap={false}>
                                <Location />
                                <BodyShort size="small">
                                    <span className="sr-only">Sted</span>
                                    {location}
                                </BodyShort>
                            </HStack>
                        )}
                    </HStack>

                    {deadline && sommerjobbAd.applicationDue && (
                        <HStack gap="2" align="center" wrap={false}>
                            <Calendar />
                            <BodyShort size="small">
                                <span className="sr-only">Søknadsfrist</span>
                                {deadlineText(deadline, new Date(), sommerjobbAd.applicationDue)}
                            </BodyShort>
                        </HStack>
                    )}
                    {isDebug && <DebugItem sommerjobbAd={sommerjobbAd} />}
                </div>
                <VStack justify="center">
                    <ChevronRightIcon className="chevron" fontSize="1.5rem" aria-hidden="true" />
                </VStack>
            </HStack>
        </Box>
    );
}

export default SommerjobbItem;
