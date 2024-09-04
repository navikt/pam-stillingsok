import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/(sok)/_components/filters/Education";
import { CheckmarkIcon, ExclamationmarkTriangleIcon, ThumbUpIcon, XMarkIcon } from "@navikt/aksel-icons";
import logAmplitudeEvent from "@/app/_common/monitoring/amplitude";
import { useRouter } from "next/navigation";

function DebugAdItem({ value, vote, showButton }) {
    return (
        <Box
            background={value.isChecked ? "surface-alt-1" : "surface-alt-1-subtle"}
            paddingInline="4 0"
            borderRadius="full"
        >
            <HStack align="center" gap="1" justify="space-between">
                {value.isChecked && <CheckmarkIcon />}
                <BodyShort className="flex-1" textColor={!value.isChecked && "subtle"}>
                    {value.isChecked ? <strong>{value.label}</strong> : <strike>{value.label}</strike>}
                </BodyShort>
                {showButton ? (
                    <Button
                        size="small"
                        variant="tertiary-neutral"
                        aria-label="Stem ned"
                        onClick={() => {
                            vote(value, value.isChecked ? "Feil" : "Mangler");
                        }}
                        icon={<ExclamationmarkTriangleIcon fontSize="1rem" />}
                    >
                        {value.isChecked ? "Feil" : "Mangler"}
                    </Button>
                ) : (
                    <Box height="36px" />
                )}
            </HStack>
        </Box>
    );
}

function DebugAdGroup({ category, values, adUuid }) {
    const [valuesToBeVoted, setValuesToBeVoted] = useState(values);
    const [showReportButtons, setShowReportButtons] = useState(true);
    const [showSubReportButtons, setShowSubReportButtons] = useState(false);

    const vote = (value, reason) => {
        setValuesToBeVoted((prevState) => prevState.filter((it) => it.label !== value.label));
        logAmplitudeEvent("Reported AI category value", {
            category,
            value: value.label,
            reason,
            adUuid,
        });
    };

    if (!values || values.length === 0) {
        return null;
    }

    return (
        <Box borderWidth="0 0 1 0" borderColor="border-subtle" padding="4 4 6 4">
            <HStack align="center" justify="space-between" className="mb-4">
                <Heading size="small" level="3">
                    {category}
                </Heading>
                <HStack>
                    {showReportButtons ? (
                        <>
                            <Button
                                variant="tertiary-neutral"
                                size="small"
                                icon={<ThumbUpIcon fontSize="1rem" />}
                                onClick={() => {
                                    logAmplitudeEvent("Reported AI categorization", {
                                        category,
                                        reason: "Ingen feil",
                                        adUuid,
                                    });
                                    setShowSubReportButtons(false);
                                    setShowReportButtons(false);
                                }}
                            >
                                Alt er riktig
                            </Button>
                            <Button
                                variant="tertiary-neutral"
                                size="small"
                                icon={<ExclamationmarkTriangleIcon fontSize="1rem" />}
                                onClick={() => {
                                    logAmplitudeEvent("Reported AI categorization", {
                                        category,
                                        reason: "En eller flere feil",
                                        adUuid,
                                    });
                                    setShowSubReportButtons(true);
                                    setShowReportButtons(false);
                                }}
                            >
                                Har feil
                            </Button>
                        </>
                    ) : (
                        <Box height="36px" />
                    )}
                </HStack>
            </HStack>
            <VStack gap="1">
                {values.map((value) => (
                    <DebugAdItem
                        key={value.label}
                        value={value}
                        vote={vote}
                        showButton={showSubReportButtons && valuesToBeVoted.includes(value)}
                    />
                ))}
            </VStack>
        </Box>
    );
}

export default function DebugAd({ adData }) {
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const router = useRouter();

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
        isChecked: adData?.experience?.includes(it) || false,
    }));

    const educationValues = [
        "Ingen krav",
        "Videregående",
        "Fagbrev",
        "Fagskole",
        "Bachelor",
        "Master",
        "Forskningsgrad",
    ].map((it) => ({
        label: labelForEducation(it),
        isChecked: adData?.education?.includes(it) || false,
    }));

    const driverLicenseValues = adData?.needDriversLicense.map((it) => ({
        label: labelForNeedDriversLicense(it),
        isChecked: true,
    }));

    return (
        <Box className="debugAd">
            <Box padding="4 4 0 4">
                <HStack align="center" justify="space-between">
                    <Heading level="2" size="medium">
                        KI-kategorier
                    </Heading>
                    <Button
                        aria-label="Lukk"
                        variant="tertiary-neutral"
                        icon={<XMarkIcon />}
                        onClick={hideDebugPanel}
                    />
                </HStack>
            </Box>

            <DebugAdGroup adUuid={adData.id} category="Erfaring" values={experienceValues} />
            <DebugAdGroup adUuid={adData.id} category="Utdanning" values={educationValues} />
            <DebugAdGroup adUuid={adData.id} category="Førerkort" values={driverLicenseValues} />

            <Box padding="0 4">
                <Button
                    className="mt-8 full-width"
                    variant="secondary-neutral"
                    onClick={() => {
                        router.back();
                    }}
                >
                    Gå tilbake
                </Button>
            </Box>
        </Box>
    );
}

DebugAd.propTypes = {
    adData: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
};