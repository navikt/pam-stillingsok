import React, { useEffect, useState } from "react";
import { BodyLong, Button, Modal, HStack, VStack } from "@navikt/ds-react";
import { FigureWithKey } from "@navikt/arbeidsplassen-react";

type SessionStatusModalProps = {
    markAsLoggedOut: () => void;
    setHasBeenLoggedIn: (value: boolean) => void;
    login: () => void;
    logout: () => void;
    timeoutLogout: () => void;
    hasBeenLoggedIn: boolean;
};
const SessionStatusModal = ({
    markAsLoggedOut,
    setHasBeenLoggedIn,
    login,
    logout,
    timeoutLogout,
    hasBeenLoggedIn,
}: SessionStatusModalProps) => {
    const [isSessionExpiring, setIsSessionExpiring] = useState(false);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(false);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
    const [sessionExpiringInMinutes, setSessionExpiringInMinutes] = useState(10);
    const [sessionTimingOutInMinutes, setSessionTimingOutInMinutes] = useState(10);

    const handleSessionInfoResponse = async (
        response: Response,
        isCurrentlyLoggedIn: boolean,
        errorMessage: string,
    ) => {
        if (response.status === 401) {
            markAsLoggedOut();
            if (isCurrentlyLoggedIn) {
                setHasBeenLoggedIn(false);
                timeoutLogout();
            }
        } else if (response.status < 200 || response.status >= 300) {
            console.error(errorMessage);
        } else {
            const { session, tokens } = await response.json();

            if (!session.active) {
                markAsLoggedOut();
                setHasBeenLoggedIn(false);
                timeoutLogout();
                return;
            }

            setHasBeenLoggedIn(true);

            const sessionIsExpiring = session.ends_in_seconds < 60 * 10;
            setSessionExpiringInMinutes(Math.floor(session.ends_in_seconds / 60));

            const sessionIsTimingOut =
                session.timeout_in_seconds > -1
                    ? session.timeout_in_seconds < 60 * 10
                    : tokens.expire_in_seconds < 60 * 10;

            setSessionTimingOutInMinutes(
                Math.floor(
                    session.timeout_in_seconds > -1 ? session.timeout_in_seconds / 60 : tokens.expire_in_seconds / 60,
                ),
            );

            setIsSessionExpiring(sessionIsExpiring);
            setIsSessionTimingOut(sessionIsTimingOut);
        }
    };

    const fetchSessionInfo = async (isCurrentlyLoggedIn: boolean) => {
        const response = await fetch(`/oauth2/session`, {
            credentials: "include",
            referrer: process.env.NEXT_PUBLIC_CONTEXT_PATH,
        }).catch((e) => {
            // eslint-disable-next-line
            console.error("Det oppstod en feil ved henting av session status", e.message);
        });
        if (!response) return;
        await handleSessionInfoResponse(
            response,
            isCurrentlyLoggedIn,
            "Det oppstod en feil ved henting av session status",
        );
    };

    const refreshToken = async (isCurrentlyLoggedIn: boolean) => {
        const response = await fetch(`/oauth2/session/refresh`, {
            method: "POST",
            credentials: "include",
            referrer: process.env.NEXT_PUBLIC_CONTEXT_PATH,
        });
        await handleSessionInfoResponse(response, isCurrentlyLoggedIn, "Det oppstod en feil ved refreshing av token");
    };

    let title = "Din pålogging utløper snart";
    let message;
    let actionText;
    let closeText = "";
    let action = () => {};

    if (isSessionExpiring) {
        message = `Din pålogging utløper om ${sessionExpiringInMinutes} minutter. Logg inn på nytt for å fortsette, eller avslutt og logg ut.`;
        actionText = "Logg inn på nytt";
        closeText = "Avslutt";
        action = login;
    } else if (isSessionTimingOut) {
        title = "Forbli innlogget?";
        message = `Av sikkerhetsgrunner lurer vi på om du vil fortsette å være innlogget. Hvis du ikke velger å fortsette, vil du automatisk bli logget ut om ${sessionTimingOutInMinutes} minutter.`;
        actionText = "Fortsett å være innlogget";
        closeText = "Logg ut";
        action = () => refreshToken(hasBeenLoggedIn);
    }

    useEffect(() => {
        const scheduledInterval = setInterval(() => {
            if (hasBeenLoggedIn) fetchSessionInfo(hasBeenLoggedIn);
        }, 30 * 1000);
        if (hasBeenLoggedIn) fetchSessionInfo(hasBeenLoggedIn);
        return () => clearInterval(scheduledInterval);
    }, [hasBeenLoggedIn]);

    useEffect(() => {
        setIsTimeoutModalOpen(isSessionExpiring || isSessionTimingOut);
    }, [isSessionTimingOut, isSessionExpiring]);

    if (!isTimeoutModalOpen) return null;

    return (
        <Modal
            width="small"
            role="alertdialog"
            header={{ heading: title || "", closeButton: false }}
            open
            onCancel={(e) => e.preventDefault()}
            onClose={() => {}}
        >
            <Modal.Body>
                <VStack gap="6">
                    <BodyLong role="timer" suppressHydrationWarning>
                        {message}
                    </BodyLong>
                    <HStack justify="center">
                        <FigureWithKey />
                    </HStack>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={action}>
                    {actionText}
                </Button>

                <Button variant="secondary" onClick={logout}>
                    {closeText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SessionStatusModal;
