import React, { ReactNode, useState } from "react";
import { BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { labelForNeedDriversLicense } from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/stillinger/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/stillinger/(sok)/_components/filters/Education";
import { CheckmarkIcon, ExclamationmarkTriangleIcon, ThumbUpIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/navigation";
import { StillingDetaljer } from "@/app/stillinger/_common/lib/stillingSchema";
import { labelForUnder18 } from "@/app/stillinger/(sok)/_components/filters/Under18";
import useIsDebug from "@/app/stillinger/(sok)/_components/IsDebugProvider";

type DebugAdItemProps = {
    value: Value;
    vote: (value: Value, reason: string) => void;
    showButton: boolean;
};
function DebugAdItem({ value, vote, showButton }: DebugAdItemProps): ReactNode {
    return (
        <Box
            background={value.isChecked ? "surface-alt-1" : "surface-alt-1-subtle"}
            paddingInline="4 0"
            borderRadius="full"
        >
            <HStack align="center" gap="1" justify="space-between">
                {value.isChecked && <CheckmarkIcon />}
                <BodyShort className="flex-1" textColor={!value.isChecked ? "subtle" : undefined}>
                    {value.isChecked ? (
                        <strong>{value.label}</strong>
                    ) : (
                        <span style={{ textDecoration: "line-through" }}>{value.label}</span>
                    )}
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
type Value = {
    label: string;
    isChecked: boolean;
};
type DebugAdGroupProps = {
    adUuid: string | undefined;
    values: Value[] | undefined;
    category: string;
};
function DebugAdGroup({ category, values }: DebugAdGroupProps): ReactNode {
    const [valuesToBeVoted, setValuesToBeVoted] = useState(values);
    const [showReportButtons, setShowReportButtons] = useState(true);
    const [showSubReportButtons, setShowSubReportButtons] = useState(false);

    const vote = (value: Value): void => {
        setValuesToBeVoted((prevState) => prevState?.filter((it) => it.label !== value.label));
    };

    if (!values || values.length === 0) {
        return null;
    }

    return (
        <Box borderWidth="0 0 1 0" borderColor="border-subtle" paddingInline="4 4" paddingBlock="4 6">
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
                {values?.map((value) => (
                    <DebugAdItem
                        key={value.label}
                        value={value}
                        vote={vote}
                        showButton={(showSubReportButtons && valuesToBeVoted?.includes(value)) ?? false}
                    />
                ))}
            </VStack>
        </Box>
    );
}
type PageProps = {
    adData: StillingDetaljer;
};
export default function DebugAd({ adData }: PageProps): ReactNode {
    const router = useRouter();
    const { isDebug } = useIsDebug();

    if (!isDebug) {
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

    const driverLicenseValues = adData?.needDriversLicense?.map((it) => ({
        label: labelForNeedDriversLicense(it),
        isChecked: true,
    }));

    const under18Values = adData?.under18?.map((it) => ({
        label: labelForUnder18(it),
        isChecked: true,
    }));

    return (
        <Box className="debugAd">
            <Box paddingInline="4 4" paddingBlock="4 0">
                <Heading level="2" size="medium">
                    KI-kategorier
                </Heading>
            </Box>

            <DebugAdGroup adUuid={adData.id} category="Erfaring" values={experienceValues} />
            <DebugAdGroup adUuid={adData.id} category="Utdanning" values={educationValues} />
            <DebugAdGroup adUuid={adData.id} category="Førerkort" values={driverLicenseValues} />
            <DebugAdGroup adUuid={adData.id} category="Under18" values={under18Values} />

            <Box paddingInline="4 4" paddingBlock="0 0">
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
