"use client";

import { BodyLong, Box, Button, Heading, LocalAlert, Stack, VStack } from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { track } from "@/app/_common/umami";
import { MELD_INTERESSE_TIL_VEILEDER } from "@/app/_common/umami/constants";
import { cn } from "@/app/_common/utils/cn";
import { meldInteresseAction } from "@/app/muligheter/mulighet/[id]/meld-interesse/actions";
import type { AdDTO } from "@/app/stillinger/_common/lib/ad-model";
import getDeadlineMessage from "@/app/stillinger/_common/utils/getDeadlineMessage";
import styles from "./howToApplyMuligheter.module.css";

type PageProps = {
    adData: AdDTO;
};
export default function HowToApplyMuligheter({ adData }: PageProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState(false);

    const deadlineMessage = getDeadlineMessage({
        dueDateIso: adData.application.applicationDueDate,
        dueLabel: adData.application.applicationDueLabel,
        now: new Date(),
    });

    function handleClick() {
        setError(false);

        startTransition(async () => {
            const result = await meldInteresseAction(adData.id || "");
            if (result.success) {
                track(MELD_INTERESSE_TIL_VEILEDER, {
                    adid: adData.id || "",
                    title: adData.title || "",
                    href: `/muligheter/mulighet/${adData.id}/meld-interesse`,
                    source: "Meld interesse til veileder",
                });
                router.push(`/muligheter/mulighet/${adData.id}/meld-interesse?submitted=true`);
            } else {
                setError(true);
            }
        });
    }

    return (
        <>
            <Box
                borderRadius="4"
                padding="space-16"
                className={cn(styles["mulighet-vis-interesse"], "full-width", "mb-10")}
            >
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
                            Når du viser interesse for jobben sendes en beskjed til din veileder i dialogmeldingen på
                            nav.no
                        </BodyLong>
                        {deadlineMessage && <BodyLong weight="semibold">{deadlineMessage}</BodyLong>}
                    </VStack>

                    <Button variant="primary" onClick={handleClick} loading={isPending}>
                        <span className={styles["muligheter-button-text"]}>Vis interesse</span>
                    </Button>
                </Stack>
            </Box>

            {error && (
                <LocalAlert status="error" className="mb-4" role="alert">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Det oppstod en feil!</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        <BodyLong>Det oppstod en feil ved melding av interesse. Vennligst prøv igjen senere.</BodyLong>
                    </LocalAlert.Content>
                </LocalAlert>
            )}
        </>
    );
}
