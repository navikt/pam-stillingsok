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
import { StillingSoekResponseExplanation } from "@/server/schemas/stillingSearchSchema";

interface DebugExplainProps {
    explanation: StillingSoekResponseExplanation;
    defaultOpen?: boolean;
}

interface SommerjobbItemProps {
    sommerjobbAd: SommerjobbAd;
}

function DebugExplain({ explanation }: DebugExplainProps): ReactElement {
    return (
        <>
            {explanation.details.length > 0 && (
                <>
                    {explanation.description.startsWith("weight(") && (
                        <Box background="surface-subtle" padding="1">
                            <BodyShort size="small">
                                {explanation.description.split("weight(")[1].split(" ")[0].split(":").join("=")}
                            </BodyShort>
                        </Box>
                    )}
                    {explanation.details.length > 0 &&
                        explanation.details.map((it) => <DebugExplain explanation={it} key={it.description} />)}
                </>
            )}
        </>
    );
}

function SommerjobbItem({ sommerjobbAd }: SommerjobbItemProps): ReactElement {
    const deadline = sommerjobbAd.applicationDue ? formatDate(sommerjobbAd.applicationDue) : undefined;
    let location = sommerjobbAd.location;
    const employerName = sommerjobbAd.employer.name;
    const ariaLabel = [sommerjobbAd.title, employerName, location].join(", ");

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
            >
                <div className="min-width">
                    <Heading className="link mb-1" size="small" level="3">
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
                    {sommerjobbAd.explanation && sommerjobbAd.explanation.details.length > 0 && (
                        <Box paddingBlock="4">
                            <HStack gap="2">
                                <Box background="surface-subtle" padding="1">
                                    <BodyShort size="small" weight="semibold">
                                        {Math.abs(sommerjobbAd.explanation.value) % 1 > 0
                                            ? sommerjobbAd.explanation.value.toFixed(2)
                                            : sommerjobbAd.explanation.value}
                                    </BodyShort>
                                </Box>
                                <DebugExplain explanation={sommerjobbAd.explanation} />
                            </HStack>
                        </Box>
                    )}
                </div>
                <VStack justify="center">
                    <ChevronRightIcon className="chevron" fontSize="1.5rem" aria-hidden="true" />
                </VStack>
            </HStack>
        </Box>
    );
}

export default SommerjobbItem;
