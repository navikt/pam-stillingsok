"use client";

import { BodyLong, Box, Heading, LocalAlert, Tag } from "@navikt/ds-react";
import { type ReactNode, useEffect } from "react";
import { useEngagementTimer } from "@/app/_common/tracking/useEngagementTimer";
import { useFlowId } from "@/app/_common/tracking/useFlowId";
import { ViewportEventTracker } from "@/app/_common/tracking/ViewportEventTracker";
import { track } from "@/app/_common/umami";
import { ClientExperiment } from "@/app/_experiments/client/ClientExperiment";
import { useExperimentVariant } from "@/app/_experiments/client/ExperimentProvider";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import type { Qualification } from "@/app/stillinger/stilling/[id]/superrask-soknad/_types/Application";
import AdAdminBar from "./AdAdminBar";
import AdDetails from "./AdDetails";
import AdText from "./AdText";
import ContactPerson from "./ContactPerson";
import EmployerDetails from "./EmployerDetails";
import EmploymentDetails from "./EmploymentDetails";
import HowToApply from "./HowToApply";
import QualificationsPreview from "./QualificationsPreview";
import ShareAd from "./ShareAd";
import Summary from "./Summary";

type PageProps = {
    adData: AdDTO;
    organizationNumber?: string | undefined;
    qualifications?: Qualification[];
};
function Ad({ adData, organizationNumber, qualifications }: PageProps): ReactNode {
    const qualificationPreviewVariant = useExperimentVariant("qualifications_soek_superrask_cta");
    const annonseErAktiv = adData?.status === "ACTIVE";
    const flowId = useFlowId();

    useEffect(() => {
        const location = adData.locationList?.[0];
        track("Stillingsvisning", {
            annonseId: adData.id,

            // om arbeidsgiver
            employer: adData.employer?.name ?? "",
            orgNumber: adData.employer?.orgnr ?? "",
            postalCode: Number(location?.postalCode ?? 0),
            city: location?.city ?? "",
            county: location?.county ?? "",
            country: location?.country ?? "",

            // om annonsen
            adtextFormat: adData.adTextFormat ?? "",
            hasSuperrask: adData.application.hasSuperraskSoknad ?? false,
            applicationTypes: "",
            engagementtype: adData.engagementType ?? "",
            extent: adData.extent?.join(", ") ?? "",
            jobpercentage: adData.jobPercentage ?? "",
            jobpercentagerange: "",
            jobtitle: adData.jobTitle ?? "",
            remote: adData.remoteOptions ?? "",
            sector: adData.employer?.sector ?? "",
            workday: adData.workDays?.join(", ") ?? "",
            workhours: adData.workHours?.join(", ") ?? "",
            workLanguage: adData.workLanguages?.join(", ") ?? "",
            source: adData.source ?? "",
            status: adData.status ?? "",
            title: adData.title ?? "",

            // KI verdier
            ai_competences: adData.aiCompetences?.join(", ") ?? "",
            ai_isUnder18: adData.aiIsUnder18 ?? false,
            ai_isSummerJob: adData.aiIsSummerJob ?? false,
            ai_shortSummary: adData.shortSummary ?? "",
            ai_remote: adData.aiRemoteOptions ?? "",
            ai_workExperience: adData.aiWorkExperience ?? "",
        });
    }, [adData.id]);

    useEngagementTimer({
        eventName: "tid på stilling",
        resetKey: `${adData.id}`,
        getPayload: ({ tidTotalMs, tidAktivMs }) => {
            return {
                flowId,
                annonseId: adData.id,
                tidTotalMs,
                tidAktivMs,
            };
        },
    });

    return (
        <>
            <AdAdminBar adData={adData} organizationNumber={organizationNumber} />

            <Box paddingBlock={{ xs: "space-16 space-48", md: "space-40 space-64" }}>
                <Heading level="1" size="xlarge" className="overflow-wrap-anywhere" spacing>
                    {adData?.title}
                </Heading>
                <Summary adData={adData} />
                {!annonseErAktiv && (
                    <Tag variant="warning-moderate" className="mt-4">
                        Stillingsannonsen er inaktiv.
                    </Tag>
                )}

                <EmploymentDetails adData={adData} />

                {annonseErAktiv && qualifications && qualifications.length > 0 && (
                    <ClientExperiment
                        variant={qualificationPreviewVariant}
                        standard={null}
                        test={<QualificationsPreview qualifications={qualifications} />}
                    />
                )}
                {annonseErAktiv && <HowToApply adData={adData} />}
                {adData.isZodError && (
                    <LocalAlert status="warning" className="mb-4">
                        <LocalAlert.Header>
                            <LocalAlert.Title>Problemer med visning av stillingsannonsen</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>
                            <BodyLong>
                                Vi har for tiden problemer med å vise stillingsannonsen. Vi jobber med å løse problemet
                                så raskt som mulig.
                            </BodyLong>
                        </LocalAlert.Content>
                    </LocalAlert>
                )}

                {adData.adTextHtml && <AdText adText={adData.adTextHtml} />}

                <ViewportEventTracker
                    eventName="sett bunnen av annonseteksten"
                    resetKey={adData.id}
                    minTimeOnPageMs={0}
                    getPayload={({ timeOnPageMs }) => {
                        return {
                            flowId,
                            annonseId: adData.id,
                            tidSynligMs: Math.round(timeOnPageMs),
                        };
                    }}
                />
                {annonseErAktiv && (
                    <ContactPerson contactList={adData.contactList} adId={adData.id} adTitle={adData.title} />
                )}
                {adData.employer && <EmployerDetails employer={adData.employer} />}

                {annonseErAktiv && <ShareAd adData={adData} />}
                <AdDetails adData={adData} />
            </Box>
        </>
    );
}

export default Ad;
