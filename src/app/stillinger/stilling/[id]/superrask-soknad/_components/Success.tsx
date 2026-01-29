"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { BodyLong, Button, Heading, Alert } from "@navikt/ds-react";
import { resendVerificationEmail } from "@/app/stillinger/stilling/[id]/superrask-soknad/_actions/resendVerificationEmail";

type ResendState = { status: "initial" } | { status: "loading" } | { status: "success" } | { status: "error" };

type SuccessProps = {
    email: string;
    applicationId?: string;
};

const RESEND_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

function Success({ email, applicationId }: SuccessProps): ReactElement {
    const ref = useRef<HTMLDivElement>(null);
    const [resendState, setResendState] = useState<ResendState>({ status: "initial" });
    const [isResendOnCooldown, setIsResendOnCooldown] = useState<boolean>(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        setResendState({ status: "loading" });

        const result = await resendVerificationEmail(applicationId!!);

        if (result.success) {
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

    return (
        <>
            <Heading level="1" size="large" spacing ref={ref} tabIndex={-1} aria-live="polite" role="alert">
                Verifiser eposten din for å sende søknaden
            </Heading>
            <BodyLong spacing>
                Vi har sendt en lenke til {email}. Klikk på lenken for å sende søknaden. Lenken er gyldig i 24 timer.
            </BodyLong>
            <Heading level="2" spacing size="medium">
                Fikk du ikke e-posten?
            </Heading>

            {resendState.status === "success" && (
                <Alert variant="success" className="mb-4">
                    Verifiseringslenken er sendt på nytt
                </Alert>
            )}

            {resendState.status === "error" && (
                <Alert variant="error" className="mb-4">
                    En feil oppstod ved sending av verifiseringslenken
                </Alert>
            )}

            {isResendOnCooldown && <BodyLong spacing>Du må vente 2 minutter før du kan sende ny verifiseringslenke</BodyLong>}

            <Button
                variant="secondary"
                onClick={onResendClick}
                loading={resendState.status === "loading"}
                disabled={resendState.status === "loading" || isResendOnCooldown}
            >
                Send lenken på nytt
            </Button>
        </>
    );
}

export default Success;
