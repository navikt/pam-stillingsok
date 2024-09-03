import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Box, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { ThumbDownIcon, ThumbUpIcon } from "@navikt/aksel-icons";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

function vote(category, value, reason, adUuid) {
    logAmplitudeEvent("Report AI category", { category, value, reason, adUuid });
}

function DebugAdItem({ category, value, adUuid }) {
    const [hasVoted, setHasVoted] = useState(false);

    return (
        <Tag variant="neutral-moderate">
            <HStack align="center" gap="4">
                {value}
                <HStack gap="2">
                    {!hasVoted && (
                        <>
                            <ThumbUpIcon
                                title="Stem opp"
                                fontSize="1.25rem"
                                onClick={() => {
                                    setHasVoted(true);
                                    vote(category, value, "Vote up", adUuid);
                                }}
                            />
                            <ThumbDownIcon
                                title="Stem ned"
                                fontSize="1.25rem"
                                onClick={() => {
                                    setHasVoted(true);
                                    vote(category, value, "Vote down", adUuid);
                                }}
                            />
                        </>
                    )}
                </HStack>
            </HStack>
        </Tag>
    );
}

function DebugAdGroup({ category, values, adUuid }) {
    if (!values) {
        return null;
    }

    return (
        <div>
            <Heading size="xsmall" level="3" spacing>
                {category}
            </Heading>
            <HStack gap="4">
                {values.map((value) => (
                    <DebugAdItem key={value} category={category} value={value} adUuid={adUuid} />
                ))}
            </HStack>
        </div>
    );
}

export default function DebugAd({ adData }) {
    const [showDebugPanel, setShowDebugPanel] = useState(false);

    useEffect(() => {
        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setShowDebugPanel(true);
            }
        } catch (err) {
            // ignore
        }
    }, []);

    if (!showDebugPanel) {
        return null;
    }

    return (
        <Box className="full-width mt-16">
            <Heading level="2" size="large" spacing>
                Har annonsen kommet i feil kategori?
            </Heading>
            <BodyLong spacing>Gi en tommel ned på de kategoriene som ikke stemmer.</BodyLong>
            <VStack gap="6">
                <DebugAdGroup
                    adUuid={adData.id}
                    category="Yrke"
                    values={adData.categoryList?.map(
                        (category) => `${category.name} (${category.categoryType.toLowerCase()})`,
                    )}
                />
                <DebugAdGroup
                    adUuid={adData.id}
                    category="Lignende yrker"
                    values={adData?.searchtags?.map((tag) => tag.label)}
                />
                <DebugAdGroup
                    adUuid={adData.id}
                    category="Erfaring"
                    values={adData?.experience?.map((experience) => labelForExperience(experience))}
                />
                <DebugAdGroup
                    adUuid={adData.id}
                    category="Utdanning"
                    values={adData?.education?.map((education) => labelForEducation(education))}
                />
                <DebugAdGroup
                    adUuid={adData.id}
                    category="Førerkort"
                    values={adData?.needDriversLicense?.map((item) => labelForNeedDriversLicense(item))}
                />
            </VStack>
        </Box>
    );
}

DebugAd.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
};
