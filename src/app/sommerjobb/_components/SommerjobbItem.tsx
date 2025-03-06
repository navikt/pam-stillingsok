import React, { forwardRef, MutableRefObject, ReactElement, useId } from "react";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
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
    const headingId = useId();
    const location = sommerjobbAd.location;
    const employerName = sommerjobbAd.location;

    return (
        <Box
            ref={ref as MutableRefObject<HTMLDivElement>}
            tabIndex={-1}
            as="article"
            shadow="small"
            background="surface-default"
            borderRadius="small"
            aria-label={[sommerjobbAd.title, employerName, location].join(", ")}
        >
            <Link aria-labelledby={headingId} className="custom-link-panel" href={`/stilling/${sommerjobbAd.uuid}`}>
                <div>
                    <Heading id={headingId} className="link" size="small" level="3" spacing>
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
                <ChevronRightIcon aria-hidden="true" className="chevron" />
            </Link>
        </Box>
    );
});

export default SommerjobbItem;
