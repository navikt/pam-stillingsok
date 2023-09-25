import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import LoginBubble from "../../../common/components/icons/LoginBubble";
import "./TimeoutModal.css";

export const Reason = {
    TIMEOUT: "TIMEOUT",
    EXPIRY: "EXPIRY",
    NO_MODAL: "NO_MODAL",
};

function TimeoutModal({ modalReason, refresh, login, logout }) {
    let title;
    let message;
    let actionText;
    let closeText = "";
    let action = () => {};

    if (modalReason === Reason.TIMEOUT) {
        title = "Forbli innlogget?";
        message =
            "Av sikkerhetsgrunner lurer vi på om du vil fortsette å være innlogget. Hvis du ikke velger å fortsette, vil du automatisk bli logget ut innen kort tid.";
        actionText = "Fortsett å være innlogget";
        closeText = "Logg ut";
        action = refresh;
    } else if (modalReason === Reason.EXPIRY) {
        title = "Din pålogging utløper snart";
        message = "Logg inn på nytt for å fortsette, eller avslutt og logg ut.";
        actionText = "Logg inn på nytt";
        closeText = "Avslutt";
        action = login;
    } else {
        return null;
    }

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

                    {modalReason !== Reason.LOGGED_OUT && (
                        <Button variant="secondary" onClick={logout}>
                            {closeText}
                        </Button>
                    )}
                </div>
            </section>
        </Modal>
    );
}

TimeoutModal.propTypes = {
    modalReason: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

export default TimeoutModal;
