import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, Hide, HStack, Show, VStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import ChevronRight from "@/app/sommerjobb/_components/icons/ChevronRight";
import Employer from "@/app/sommerjobb/_components/icons/Employer";
import Location from "@/app/sommerjobb/_components/icons/Location";
import Calendar from "@/app/sommerjobb/_components/icons/Calendar";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";
import Link from "next/link";
import parse from "html-react-parser";
import { renderToString } from "react-dom/server";

function trimText(text: string | undefined, length: number) {
    if (text && text.length > length) {
        return text.substring(0, length).trim().concat("...");
    }
    return text;
}

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    const deadline = sommerjobbAd.applicationDue ? formatDate(sommerjobbAd.applicationDue) : undefined;
    let location = sommerjobbAd.location;
    const employerName = sommerjobbAd.employer.name;
    const ariaLabel = [sommerjobbAd.title, employerName, location].join(", ");

    const fjernTags = (str: string) => {
        if (!str) return "";
        else str = str.toString();
        return str
            .replace(/(<([^>]+)>)/gi, " ")
            .replace(/&amp;/g, "&")
            .trim();
    };

    const description = fjernTags(renderToString(parse(sommerjobbAd.description)));

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
            >
                <div className="min-width">
                    <Heading className="link mb-1" size="small" level="3">
                        {sommerjobbAd.title}
                    </Heading>

                    <Show below="md">
                        <BodyShort spacing>{trimText(description, 90)}</BodyShort>
                    </Show>
                    <Hide below="md">
                        <BodyShort spacing>{trimText(description, 185)}</BodyShort>
                    </Hide>

                    <HStack>
                        {employerName && (
                            <HStack className="margin-right mb-2 min-width" gap="2" wrap={false}>
                                <Employer />
                                <BodyShort size="small" className="text-overflow">
                                    {employerName}
                                </BodyShort>
                            </HStack>
                        )}
                        {location && (
                            <HStack gap="2" className="mb-2" align="center" wrap={false}>
                                <Location />
                                <BodyShort size="small">{location}</BodyShort>
                            </HStack>
                        )}
                    </HStack>

                    {deadline && sommerjobbAd.applicationDue && (
                        <HStack gap="2" align="center" wrap={false}>
                            <Calendar />
                            <BodyShort size="small">
                                {deadlineText(deadline, new Date(), sommerjobbAd.applicationDue)}
                            </BodyShort>
                        </HStack>
                    )}
                </div>
                <VStack justify="center">
                    <ChevronRight />
                </VStack>
            </HStack>
        </Box>
    );
}

export default SommerjobbItem;
