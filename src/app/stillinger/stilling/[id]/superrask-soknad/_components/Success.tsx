"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { BodyLong, Button, Heading, Alert } from "@navikt/ds-react";
import { resendConfirmationEmail } from "@/app/stillinger/stilling/[id]/superrask-soknad/_actions/resendConfirmationEmail";

type ResendState = { status: "initial" } | { status: "loading" } | { status: "success" } | { status: "error" };

type SuccessProps = {
    email: string;
    applicationId?: string;
};

const RESEND_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
const MAX_RESEND_ATTEMPTS = 5;

function Success({ email, applicationId }: SuccessProps): ReactElement {
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

        const result = await resendConfirmationEmail(applicationId!!);

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

    return (
        <>
            <Heading level="1" size="large" spacing ref={ref} tabIndex={-1} aria-live="polite" role="alert">
                Bekreft e-posten din for å sende søknaden
            </Heading>
            <BodyLong spacing>
                Vi har sendt en lenke til {email}. Klikk på lenken for å sende søknaden. Lenken er gyldig i 24 timer.
            </BodyLong>
            <Heading level="2" spacing size="medium">
                Fikk du ikke e-posten?
            </Heading>

            <Button
                variant="secondary"
                onClick={onResendClick}
                loading={resendState.status === "loading"}
                disabled={resendState.status === "loading" || isResendOnCooldown || hasReachedMaxAttempts}
                className="mb-4"
            >
                Send lenken på nytt
            </Button>

            {isResendOnCooldown && !hasReachedMaxAttempts && (
                <BodyLong spacing>Du må vente 2 minutter før du kan sende bekreftelseslenke på nytt.</BodyLong>
            )}

            {resendState.status === "success" && <Alert variant="success">Bekreftelseslenken er sendt på nytt.</Alert>}

            {resendState.status === "error" && (
                <Alert variant="error">Vi klarte ikke å sende bekreftelseslenken. Vennligst prøv igjen.</Alert>
            )}

            {hasReachedMaxAttempts && resendState.status !== "success" && (
                <Alert variant="warning">
                    Du har nådd maksimalt antall forsøk på å sende bekreftelseslenken. Kontakt oss på
                    nav.team.arbeidsplassen@nav.no med referansen {applicationId}, så hjelper vi deg.
                </Alert>
            )}
        </>
    );
}

export default Success;
