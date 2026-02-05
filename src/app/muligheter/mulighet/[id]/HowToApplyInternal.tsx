import React, { ReactNode } from "react";
import { BodyLong, Box, Button, Heading, Stack, VStack } from "@navikt/ds-react";
import Link from "next/link";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { MELD_INTERESSE_TIL_VEILEDER } from "@/app/_common/umami/constants";
import { type AdDTO } from "@/app/stillinger/_common/lib/ad-model";

type PageProps = {
    adData: AdDTO;
};
export default function HowToApplyInternal({ adData }: PageProps): ReactNode {
    const deadlineMessage = getDeadlineMessage({
        dueDateIso: adData.application.applicationDueDate,
        dueLabel: adData.application.applicationDueLabel,
        now: new Date(),
    });

    return (
        <Box background="surface-alt-1-moderate" borderRadius="medium" padding="4" className="full-width mb-10">
            <Stack
                wrap={false}
                gap="4"
                direction={{ xs: "column", sm: "row" }}
                justify="space-between"
                align={{ xs: "start", sm: "center" }}
            >
                <VStack className="flex-shrink-0">
                    <Heading level="2" size="small" className="mb-1">
                        Meld interesse til veilederen din
                    </Heading>
                    {deadlineMessage && <BodyLong>{deadlineMessage}</BodyLong>}
                </VStack>
                <div>
                    <Button
                        variant="primary"
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
                        Meld interesse
                    </Button>
                </div>
            </Stack>
        </Box>
    );
}
