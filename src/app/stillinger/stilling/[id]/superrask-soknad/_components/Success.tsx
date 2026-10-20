"use client";

import { Alert, BodyLong, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { useEffect, useRef, useState } from "react";
import { resendConfirmationEmail } from "@/app/stillinger/stilling/[id]/superrask-soknad/_actions/resendConfirmationEmail";

type ResendState = { status: "initial" } | { status: "loading" } | { status: "success" } | { status: "error" };

type SuccessProps = {
    email: string;
    applicationId?: string;
    employerName?: string;
};

const RESEND_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
const MAX_RESEND_ATTEMPTS = 5;

function Success({ email, applicationId, employerName }: SuccessProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [resendState, setResendState] = useState<ResendState>({ status: "initial" });
    const [isResendOnCooldown, setIsResendOnCooldown] = useState<boolean>(true);
    const [resendCount, setResendCount] = useState<number>(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setIsResendOnCooldown(false);
        }, RESEND_TIMEOUT_MS);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    async function onResendClick(): Promise<void> {
        // On click MAX_ATTEMPTS+1 click, just show warning and don't send request
        if (resendCount >= MAX_RESEND_ATTEMPTS) {
            setResendCount((count) => count + 1);
            setResendState({ status: "initial" });
            return;
        }

        setResendState({ status: "loading" });

        if (applicationId == null) {
            throw new Error("Mangler applicationId");
        }
        const result = await resendConfirmationEmail(applicationId);

        if (result.success) {
            setResendCount((count) => count + 1);
            setResendState({ status: "success" });
            setIsResendOnCooldown(true);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                setIsResendOnCooldown(false);
            }, RESEND_TIMEOUT_MS);
        } else {
            setResendState({ status: "error" });
        }
    }

    const hasReachedMaxAttempts = resendCount > MAX_RESEND_ATTEMPTS;
    const employerText = employerName ? ` til ${employerName}` : "";

    return (
        <>
            <Heading level="1" size="large" spacing ref={ref} tabIndex={-1}>
                Bekreft e-posten din for å sende søknaden
            </Heading>
            <BodyLong>
                {`Vi har sendt en lenke til ${email}. Klikk på lenken for å sende søknaden${employerText}. Lenken er gyldig i 24
                timer.`}
            </BodyLong>
            {/*TODO ARB-323 Legge til "Endre e-postadresse"-lenke. */}
            <Box marginBlock="space-48 space-0">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        Fikk du ikke e-posten?
                    </Heading>
                    <VStack align="start" gap="space-24">
                        <BodyLong>Sjekk søppelposten din. Du kan også få lenken tilsendt på nytt.</BodyLong>
                        <HStack>
                            <Button
                                variant="secondary"
                                onClick={onResendClick}
                                loading={resendState.status === "loading"}
                                disabled={
                                    resendState.status === "loading" || isResendOnCooldown || hasReachedMaxAttempts
                                }
                            >
                                Send lenken på nytt
                            </Button>
                        </HStack>
                    </VStack>

                    {isResendOnCooldown && !hasReachedMaxAttempts && (
                        <BodyLong>Du må vente 2 minutter før du kan sende bekreftelseslenke på nytt.</BodyLong>
                    )}

                    {/*TODO Erstatte bruken av avviklede Alert. */}
                    {resendState.status === "success" && (
                        <Alert variant="success">Bekreftelseslenken er sendt på nytt.</Alert>
                    )}

                    {resendState.status === "error" && (
                        <Alert variant="error">Vi klarte ikke å sende bekreftelseslenken. Vennligst prøv igjen.</Alert>
                    )}

                    {hasReachedMaxAttempts && resendState.status !== "success" && (
                        <Alert variant="warning">
                            Du har nådd maksimalt antall forsøk på å sende bekreftelseslenken. Kontakt oss på
                            nav.team.arbeidsplassen@nav.no med referansen {applicationId}, så hjelper vi deg.
                        </Alert>
                    )}
                </VStack>
            </Box>
        </>
    );
}

export default Success;
