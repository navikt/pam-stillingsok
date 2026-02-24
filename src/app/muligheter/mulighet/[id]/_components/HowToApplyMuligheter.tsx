import React, { ReactNode } from "react";
import { BodyLong, Box, Button, Heading, Stack, VStack } from "@navikt/ds-react";
import Link from "next/link";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { MELD_INTERESSE_TIL_VEILEDER } from "@/app/_common/umami/constants";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import "./howToApplyMuligheter.css";

type PageProps = {
    adData: AdDTO;
};
export default function HowToApplyMuligheter({ adData }: PageProps): ReactNode {
    const deadlineMessage = getDeadlineMessage({
        dueDateIso: adData.application.applicationDueDate,
        dueLabel: adData.application.applicationDueLabel,
        now: new Date(),
    });

    return (
        <Box borderRadius="4" padding="space-16" className="mulighet-vis-interesse full-width mb-10">
            <Stack
                wrap={false}
                gap="space-16"
                direction={{ xs: "column", sm: "row" }}
                justify="space-between"
                align={{ xs: "start", sm: "center" }}
            >
                <VStack gap="space-4">
                    <Heading level="2" size="small" className="mb-1">
                        Vis interesse for jobben
                    </Heading>
                    <BodyLong size="small">
                        Når du viser interesse for jobben sendes en beskjed til din veileder i dialogmeldingen på nav.no
                    </BodyLong>
                    {deadlineMessage && <BodyLong weight="semibold">{deadlineMessage}</BodyLong>}
                </VStack>
                <Button
                    variant="primary"
                    className="meld-interesse-button"
                    as={Link}
                    href={`/muligheter/mulighet/${adData.id}/meld-interesse`}
                    onClick={() => {
                        umamiTracking(MELD_INTERESSE_TIL_VEILEDER, {
                            adid: adData.id || "",
                            title: adData.title || "",
                            href: `/muligheter/mulighet/${adData.id}/meld-interesse`,
                            source: "Meld interesse til veileder",
                        });
                    }}
                >
                    <span className="muligheter-button-text">Vis interesse</span>
                </Button>
            </Stack>
        </Box>
    );
}
