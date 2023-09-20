import React, {useContext} from "react";
import PropTypes from "prop-types";
import {BodyLong, Button, Heading, Modal} from "@navikt/ds-react";
import {EnterIcon} from "@navikt/aksel-icons";
import {AuthenticationContext} from "../contexts/AuthenticationProvider";
import LoginBubble from "../../../common/components/icons/LoginBubble";

function TimeoutModal({ isSessionExpiring, isSessionTimingOut, onCloseClick }) {
    const { login } = useContext(AuthenticationContext);
    const message = isSessionExpiring && !isSessionTimingOut ? "Du blir snart logget ut pga inaktivitet" : "Sesjonen din er snart ferdig din pøbel!"

    console.log("HALLO")

    return (
        <Modal role="alertdialog" open aria-label="Du må logge inn først" onClose={onCloseClick}>
            <section className="LoginRequiredMessage">
                <Heading level="1" size="large" className="mb-2">
                    Ting går åt skogen
                </Heading>
                <BodyLong className="LoginRequiredMessage__text mb-8">{message}</BodyLong>
                <div className="mb-8"><LoginBubble /></div>

                <div className="login-buttons-wrapper">
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true"/>} onClick={login}>
                        Logg inn
                    </Button>

                    <Button variant="secondary" onClick={onCloseClick}>
                        Lukk
                    </Button>

                </div>
            </section>
        </Modal>
    );
}

TimeoutModal.propTypes = {
    isSessionExpiring: PropTypes.bool.isRequired,
    isSessionTimingOut: PropTypes.bool.isRequired,
    onCloseClick: PropTypes.func.isRequired,
};

export default TimeoutModal;
