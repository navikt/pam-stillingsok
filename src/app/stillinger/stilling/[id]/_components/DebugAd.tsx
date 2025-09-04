import React, { ReactNode } from "react";
import { Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import { labelForNeedDriversLicense } from "@/app/stillinger/(sok)/_components/filters/DriversLicense";
import { labelForExperience } from "@/app/stillinger/(sok)/_components/filters/Experience";
import { labelForEducation } from "@/app/stillinger/(sok)/_components/filters/Education";
import { StillingDetaljer } from "@/app/stillinger/_common/lib/stillingSchema";
import useIsDebug from "@/app/_common/debug-provider/IsDebugProvider";

type DebugAdGroupProps = {
    values: string[] | undefined;
    category: string;
};
function DebugAdGroup({ category, values }: DebugAdGroupProps): ReactNode {
    if (!values || values.length === 0) {
        return null;
    }

    return (
        <div>
            <Heading size="xsmall" level="3" className="mb-2">
                {category}
            </Heading>
            <HStack gap="2">
                {values?.map((value) => (
                    <Tag variant="neutral-moderate" key={value}>
                        {value}
                    </Tag>
                ))}
            </HStack>
        </div>
    );
}
type PageProps = {
    adData: StillingDetaljer;
};
export default function DebugAd({ adData }: PageProps): ReactNode {
    const { isDebug } = useIsDebug();

    if (!isDebug) {
        return null;
    }

    const experienceValues = adData?.experience?.map((it) => labelForExperience(it));
    const educationValues = adData?.education?.map((it) => labelForEducation(it));
    const driverLicenseValues = adData?.needDriversLicense?.map((it) => labelForNeedDriversLicense(it));

    return (
        <section className="mt-8">
            <Heading level="2" size="medium" spacing>
                KI-kategorier (debug)
            </Heading>
            <VStack gap="4">
                <DebugAdGroup category="Erfaring" values={experienceValues} />
                <DebugAdGroup category="Utdanning" values={educationValues} />
                <DebugAdGroup category="Førerkort" values={driverLicenseValues} />
            </VStack>
        </section>
    );
}
