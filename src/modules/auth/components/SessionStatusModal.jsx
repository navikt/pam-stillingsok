import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import LoginBubble from "../../../common/components/icons/LoginBubble";
import "./SessionStatusModal.css";
import { CONTEXT_PATH } from "../../../common/environment";

function SessionStatusModal({ markAsLoggedOut, setHasBeenLoggedIn, login, logout, timeoutLogout, hasBeenLoggedIn }) {
    const [isSessionExpiring, setIsSessionExpiring] = useState(null);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(null);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

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

            const sessionIsExpiring = session.ends_in_seconds < 60 * 5;
            const sessionIsTimingOut =
                session.timeout_in_seconds > -1
                    ? session.timeout_in_seconds < 60 * 5
                    : tokens.expire_in_seconds < 60 * 5;

            setIsSessionExpiring(sessionIsExpiring);
            setIsSessionTimingOut(sessionIsTimingOut);
        }
    };

    const fetchSessionInfo = async (isCurrentlyLoggedIn) => {
        const response = await fetch(`/stillinger/oauth2/session`, { credentials: "include", referrer: CONTEXT_PATH });
        await handleSessionInfoResponse(
            response,
            isCurrentlyLoggedIn,
            "Det oppstod en feil ved henting av session status",
        );
    };

    const refreshToken = async (isCurrentlyLoggedIn) => {
        const response = await fetch(`/stillinger/oauth2/session/refresh`, {
            method: "POST",
            credentials: "include",
            referrer: CONTEXT_PATH,
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
        message = "Logg inn på nytt for å fortsette, eller avslutt og logg ut.";
        actionText = "Logg inn på nytt";
        closeText = "Avslutt";
        action = login;
    } else if (isSessionTimingOut) {
        title = "Forbli innlogget?";
        message =
            "Av sikkerhetsgrunner lurer vi på om du vil fortsette å være innlogget. Hvis du ikke velger å fortsette, vil du automatisk bli logget ut innen kort tid.";
        actionText = "Fortsett å være innlogget";
        closeText = "Logg ut";
        action = () => refreshToken(hasBeenLoggedIn);
    }

    useEffect(() => {
        const scheduledInterval = setInterval(() => fetchSessionInfo(hasBeenLoggedIn), 30 * 1000);
        fetchSessionInfo(hasBeenLoggedIn);
        return () => clearInterval(scheduledInterval);
    }, [hasBeenLoggedIn]);

    useEffect(() => {
        setIsTimeoutModalOpen(isSessionExpiring || isSessionTimingOut);
    }, [isSessionTimingOut, isSessionExpiring]);

    if (!isTimeoutModalOpen) return null;

    return (
        <Modal role="alertdialog" open aria-label={title} closeButton={false} onClose={() => {}}>
            <section className="LoginRequiredMessage">
                <Heading level="1" size="large" className="mb-2">
                    {title}
                </Heading>
                <BodyLong className="LoginRequiredMessage__text mb-8 TimeoutModalBody">{message}</BodyLong>
                <div className="mb-8">
                    <LoginBubble />
                </div>

                <div className="login-buttons-wrapper">
                    <Button variant="primary" onClick={action}>
                        {actionText}
                    </Button>

                    <Button variant="secondary" onClick={logout}>
                        {closeText}
                    </Button>
                </div>
            </section>
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
