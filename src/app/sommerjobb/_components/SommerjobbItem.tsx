import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import Employer from "@/app/_common/icons/Employer";
import Location from "@/app/_common/icons/Location";
import Calendar from "@/app/_common/icons/Calendar";

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    return (
        <div>
            <Box as="article" shadow="small" background="surface-default" borderRadius="small">
                <a className={`custom-link-panel`} href="#">
                    <div>
                        <Heading className={`link`} size="small" level="3" spacing>
                            {sommerjobbAd.title}
                        </Heading>

                        <BodyShort spacing>{sommerjobbAd.description}</BodyShort>

                        <HStack>
                            <HStack className={`margin-right`} gap="2">
                                <Employer />
                                <BodyShort size="small">{sommerjobbAd.employerName}</BodyShort>
                            </HStack>
                            <HStack gap="2">
                                <Location />
                                <BodyShort size="small">{sommerjobbAd.location}</BodyShort>
                            </HStack>
                        </HStack>

                        <HStack gap="2">
                            <Calendar />
                            <BodyShort size="small">{sommerjobbAd.applicationDue}</BodyShort>
                        </HStack>
                    </div>
                    <ChevronRightIcon className="chevron" />
                </a>
            </Box>
        </div>
    );
}

export default SommerjobbItem;
