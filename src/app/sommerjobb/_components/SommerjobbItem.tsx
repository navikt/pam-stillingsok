import React, { forwardRef, MutableRefObject, ReactElement } from "react";
import { BodyShort, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import Employer from "@/app/_common/icons/Employer";
import Location from "@/app/_common/icons/Location";
import Calendar from "@/app/_common/icons/Calendar";
import { formatDate } from "@/app/_common/utils/utils";
import deadlineText from "@/app/_common/utils/deadlineText";
import Link from "next/link";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

const SommerjobbItem = forwardRef(function Component({ sommerjobbAd }: SommerjobbItemProps, ref): ReactElement {
    const deadline = sommerjobbAd.applicationDue ? formatDate(sommerjobbAd.applicationDue) : undefined;
    let location = sommerjobbAd.location;
    const employerName = sommerjobbAd.employerName;
    const ariaLabel = [sommerjobbAd.title, employerName, location].join(", ");
    let description = sommerjobbAd.description;

    if (sommerjobbAd.description.length > 195) {
        description = sommerjobbAd.description.substring(0, 195).concat("...");
    }

    if (location.split(", ").length > 3) {
        location = location.split(", ").splice(0, 3).join(", ").concat(" m.fl.");
    }

    return (
        <Box
            ref={ref as MutableRefObject<HTMLDivElement>}
            tabIndex={-1}
            as="article"
            shadow="small"
            background="surface-default"
            borderRadius="small"
            aria-label={ariaLabel}
        >
            <HStack
                wrap={false}
                gap="5"
                as={Link}
                aria-label={ariaLabel}
                className="custom-link-panel"
                href={`/stilling/${sommerjobbAd.uuid}`}
            >
                <div className="min-width">
                    <Heading className="link" size="small" level="3" spacing>
                        {sommerjobbAd.title}
                    </Heading>

                    <BodyShort spacing>{description}</BodyShort>

                    <HStack>
                        <HStack className="margin-right mb-2 min-width" gap="2" wrap={false}>
                            <div>
                                <Employer />
                            </div>
                            <BodyShort size="small" className="text-overflow">
                                {employerName}
                            </BodyShort>
                        </HStack>
                        <HStack gap="2" className="mb-2" align="center" wrap={false}>
                            <div>
                                <Location />
                            </div>
                            <BodyShort size="small">{location}</BodyShort>
                        </HStack>
                    </HStack>

                    {deadline && sommerjobbAd.applicationDue && (
                        <HStack gap="2" align="center" wrap={false}>
                            <div>
                                <Calendar />
                            </div>
                            <BodyShort size="small">
                                {deadlineText(deadline, new Date(), sommerjobbAd.applicationDue)}
                            </BodyShort>
                        </HStack>
                    )}
                </div>
                <VStack justify="center">
                    <ChevronRightIcon aria-hidden="true" className="chevron" />
                </VStack>
            </HStack>
        </Box>
    );
});

export default SommerjobbItem;
