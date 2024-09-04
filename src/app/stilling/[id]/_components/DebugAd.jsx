import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { CheckmarkIcon, ThumbDownIcon, ThumbUpIcon, XMarkIcon } from "@navikt/aksel-icons";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";

function vote(category, value, reason, adUuid) {
    logAmplitudeEvent("Report AI category", { category, value, reason, adUuid });
}

function DebugAdItem({ category, value, adUuid }) {
    const [hasVoted, setHasVoted] = useState(false);
    if (hasVoted) {
        return null;
    }
    return (
        <Box background={value.isChecked ? "surface-alt-1" : "surface-subtle"} paddingInline="0 4">
            <HStack align="center" gap="2">
                {!hasVoted && (
                    <HStack>
                        <Button
                            aria-label="Stem opp"
                            variant="tertiary-neutral"
                            onClick={() => {
                                setHasVoted(true);
                                vote(category, value.label, "Vote up", adUuid);
                            }}
                            icon={<ThumbUpIcon fontSize="1rem" />}
                        />
                        <Button
                            variant="tertiary-neutral"
                            aria-label="Stem ned"
                            onClick={() => {
                                setHasVoted(true);
                                vote(category, value.label, "Vote down", adUuid);
                            }}
                            icon={<ThumbDownIcon fontSize="1rem" />}
                        />
                    </HStack>
                )}
                <HStack align="center" gap="1">
                    <BodyShort className="flex-1" size="small" textColor={!value.isChecked && "subtle"}>
                        {value.isChecked ? <strong>{value.label}</strong> : <strike>{value.label}</strike>}
                    </BodyShort>
                    {value.isChecked && <CheckmarkIcon fontSize="1.25rem" />}
                </HStack>
            </HStack>
        </Box>
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
            <VStack gap="2">
                {values.map((value) => (
                    <DebugAdItem key={value} category={category} value={value} adUuid={adUuid} />
                ))}
            </VStack>
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

    const hideDebugPanel = () => {
        try {
            localStorage.setItem("isDebug", "false");
        } catch (err) {
            // ignore
        }
        setShowDebugPanel(false);
    };

    if (!showDebugPanel) {
        return null;
    }

    const experienceValues = ["Ingen", "Noe", "Mye"].map((it) => ({
        label: labelForExperience(it),
        isChecked: adData?.experience?.includes(it),
    }));

    const educationValues = ["Videregående", "Fagbrev", "Fagskole", "Bachelor", "Master", "Forskningsgrad"].map(
        (it) => ({
            label: labelForEducation(it),
            isChecked: adData?.education?.includes(it),
        }),
    );

    const driverLicenseValues = ["true", "false"].map((it) => ({
        label: labelForNeedDriversLicense(it),
        isChecked: adData?.needDriversLicense?.includes(it),
    }));

    return (
        <Box className="debugAd">
            <HStack align="center" justify="space-between">
                <Heading level="2" size="medium">
                    KI-kategorier
                </Heading>
                <Button aria-label="Lukk" variant="tertiary-neutral" icon={<XMarkIcon />} onClick={hideDebugPanel} />
            </HStack>

            <BodyLong spacing size="small">
                Gi tommel opp/ned både på tildelte kategorier (grønne) og ikke-tildelte kategorier (utsteket)
            </BodyLong>
            <VStack gap="6">
                <DebugAdGroup adUuid={adData.id} category="Erfaring" values={experienceValues} />
                <DebugAdGroup adUuid={adData.id} category="Utdanning" values={educationValues} />
                <DebugAdGroup adUuid={adData.id} category="Førerkort" values={driverLicenseValues} />
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
