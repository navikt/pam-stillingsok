import React, { forwardRef, MutableRefObject, ReactElement } from "react";
import { BodyShort, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import Employer from "@/app/stillinger/_common/icons/Employer";
import Location from "@/app/stillinger/_common/icons/Location";
import Calendar from "@/app/stillinger/_common/icons/Calendar";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";
import Link from "next/link";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

const SommerjobbItem = forwardRef(function Component({ sommerjobbAd }: SommerjobbItemProps, ref): ReactElement {
    const deadline = sommerjobbAd.applicationDue ? formatDate(sommerjobbAd.applicationDue) : undefined;
    const location = sommerjobbAd.location;
    const employerName = sommerjobbAd.employerName;
    const ariaLabel = [sommerjobbAd.title, employerName, location].join(", ");

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
                gap="4"
                as={Link}
                aria-label={ariaLabel}
                className="custom-link-panel"
                href={`/stilling/${sommerjobbAd.uuid}`}
            >
                <div>
                    <Heading className="link" size="small" level="3" spacing>
                        {sommerjobbAd.title}
                    </Heading>

                    <BodyShort spacing>{sommerjobbAd.description}</BodyShort>

                    <HStack>
                        <HStack className="margin-right mb-2" gap="2">
                            <Employer />
                            <BodyShort size="small">{employerName}</BodyShort>
                        </HStack>
                        <HStack gap="2" className="mb-2">
                            <Location />
                            <BodyShort size="small">{location}</BodyShort>
                        </HStack>
                    </HStack>

                    {deadline && sommerjobbAd.applicationDue && (
                        <HStack gap="2">
                            <Calendar />
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
