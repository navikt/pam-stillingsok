import React, { useContext, useEffect, useState } from "react";
import { BodyLong, Button, Modal, HStack, VStack } from "@navikt/ds-react";
import { FigureWithKey } from "@navikt/arbeidsplassen-react";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { broadcastLogout } from "@/app/_common/broadcast/auth";

type SessionStatusModalProps = {
    markAsLoggedOut: () => void;
    login: () => void;
    logout: () => void;
    timeoutLogout: () => void;
};
const SessionStatusModal = ({ markAsLoggedOut, login, logout, timeoutLogout }: SessionStatusModalProps) => {
    const [isSessionExpiring, setIsSessionExpiring] = useState(false);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(false);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
    const [sessionExpiringInMinutes, setSessionExpiringInMinutes] = useState(10);
    const [sessionTimingOutInMinutes, setSessionTimingOutInMinutes] = useState(10);
    const { authenticationStatus } = useContext(AuthenticationContext);

    const handleSessionInfoResponse = async (response: Response, errorMessage: string) => {
        if (response.status === 401) {
            markAsLoggedOut();
            if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
                timeoutLogout();
                broadcastLogout();
            }
        } else if (response.status < 200 || response.status >= 300) {
            console.error(errorMessage);
        } else {
            const { session, tokens } = await response.json();

            if (!session.active) {
                markAsLoggedOut();
                timeoutLogout();
                broadcastLogout();
                return;
            }

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

    const fetchSessionInfo = async () => {
        const response = await fetch(`/oauth2/session`, {
            credentials: "include",
            referrer: process.env.NEXT_PUBLIC_CONTEXT_PATH,
        }).catch((e) => {
            // eslint-disable-next-line
            console.error("Det oppstod en feil ved henting av session status", e.message);
        });
        if (!response) return;
        await handleSessionInfoResponse(response, "Det oppstod en feil ved henting av session status");
    };

    const refreshToken = async () => {
        const response = await fetch(`/oauth2/session/refresh`, {
            method: "POST",
            credentials: "include",
            referrer: process.env.NEXT_PUBLIC_CONTEXT_PATH,
        });
        await handleSessionInfoResponse(response, "Det oppstod en feil ved refreshing av token");
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
        action = () => refreshToken();
    }

    // Ping for auth status every 30 seconds while user is authenticated
    useEffect(() => {
        let scheduledInterval: NodeJS.Timeout | null = null;

        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && !scheduledInterval) {
            scheduledInterval = setInterval(() => {
                fetchSessionInfo();
            }, 30 * 1000);
        } else {
            setIsSessionExpiring(false);
            setIsSessionTimingOut(false);
            if (scheduledInterval) {
                clearInterval(scheduledInterval);
            }
        }

        return () => {
            if (scheduledInterval) {
                clearInterval(scheduledInterval);
            }
        };
    }, [authenticationStatus]);

    useEffect(() => {
        setIsTimeoutModalOpen(
            (isSessionExpiring || isSessionTimingOut) && authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED,
        );
    }, [isSessionTimingOut, isSessionExpiring, authenticationStatus]);

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
