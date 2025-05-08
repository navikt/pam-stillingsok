import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Modal, HStack, VStack } from "@navikt/ds-react";
import { FigureWithKey } from "@navikt/arbeidsplassen-react";

function SessionStatusModal({ markAsLoggedOut, setHasBeenLoggedIn, login, logout, timeoutLogout, hasBeenLoggedIn }) {
    const [isSessionExpiring, setIsSessionExpiring] = useState(null);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(null);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
    const [sessionExpiringInMinutes, setSessionExpiringInMinutes] = useState(10);
    const [sessionTimingOutInMinutes, setSessionTimingOutInMinutes] = useState(10);

    const handleSessionInfoResponse = async (response, isCurrentlyLoggedIn, errorMessage) => {
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

    const fetchSessionInfo = async (isCurrentlyLoggedIn) => {
        const response = await fetch(`/min-side/oauth2/session`, { credentials: "include", referrer: "/" });
        await handleSessionInfoResponse(
            response,
            isCurrentlyLoggedIn,
            "Det oppstod en feil ved henting av session status",
        );
    };

    const refreshToken = async (isCurrentlyLoggedIn) => {
        const response = await fetch(`/min-side/oauth2/session/refresh`, {
            method: "POST",
            credentials: "same-origin",
            referrer: "/",
        });
        await handleSessionInfoResponse(response, isCurrentlyLoggedIn, "Det oppstod en feil ved refreshing av token");
    };

    let title;
    let message;
    let actionText;
    let closeText = "";
    let action = () => {};

    if (isSessionExpiring) {
        title = "Din pålogging utløper snart";
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
        fetchSessionInfo(hasBeenLoggedIn);
        return () => clearInterval(scheduledInterval);
    }, [hasBeenLoggedIn]);

    useEffect(() => {
        setIsTimeoutModalOpen(isSessionExpiring || isSessionTimingOut);
    }, [isSessionTimingOut, isSessionExpiring]);

    if (!isTimeoutModalOpen) return null;

    return (
        <Modal
            role="alertdialog"
            open
            onClose={() => {}}
            width="small"
            header={{
                closeButton: false,
                heading: title,
            }}
        >
            <Modal.Body>
                <VStack gap="6">
                    <BodyLong
                        className="login-required-message__text mb-8 session-modal-body"
                        role="timer"
                        suppressHydrationWarning
                    >
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
}

SessionStatusModal.propTypes = {
    markAsLoggedOut: PropTypes.func.isRequired,
    setHasBeenLoggedIn: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    timeoutLogout: PropTypes.func.isRequired,
    hasBeenLoggedIn: PropTypes.bool.isRequired,
};

export default SessionStatusModal;
