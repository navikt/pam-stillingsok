import React, { forwardRef, MutableRefObject, ReactElement } from "react";
import { BodyShort, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import Employer from "@/app/_common/icons/Employer";
import Location from "@/app/_common/icons/Location";
import Calendar from "@/app/_common/icons/Calendar";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import deadlineText from "@/app/stillinger/_common/utils/deadlineText";
import Link from "next/link";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

const SommerjobbItem = forwardRef(function Component({ sommerjobbAd }: SommerjobbItemProps, ref): ReactElement {
    const deadline = sommerjobbAd.applicationDue ? formatDate(sommerjobbAd.applicationDue) : undefined;
    let location = sommerjobbAd.location;
    const employerName = sommerjobbAd.employer.name;
    const ariaLabel = [sommerjobbAd.title, employerName, location].join(", ");

    const fjernTags = (str) => {
        if (str === null || str === "") return false;
        else str = str.toString();
        return str.replace(/(<([^>]+)>)/gi, " ").trim();
    };

    let description = fjernTags(sommerjobbAd.description);

    if (description.length > 185) {
        description = description.substring(0, 185).concat("...");
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
        >
            <HStack
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

                    <BodyShort spacing>{description}</BodyShort>

                    <HStack>
                        <HStack className="margin-right mb-2 min-width" gap="2" wrap={false}>
                            <Employer />
                            <BodyShort size="small" className="text-overflow">
                                {employerName}
                            </BodyShort>
                        </HStack>
                        <HStack gap="2" className="mb-2" align="center" wrap={false}>
                            <Location />
                            <BodyShort size="small">{location}</BodyShort>
                        </HStack>
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
                    <ChevronRightIcon aria-hidden="true" className="chevron" />
                </VStack>
            </HStack>
        </Box>
    );
});

export default SommerjobbItem;
