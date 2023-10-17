import React from "react";
import PropTypes from "prop-types";
import { BodyLong, Button, HStack, Modal, VStack } from "@navikt/ds-react";
import { FigureWithKey } from "@navikt/arbeidsplassen-react";
import { EnterIcon } from "@navikt/aksel-icons";

function LoginModal({ onLoginClick, onCloseClick }) {
    return (
        <Modal
            width="small"
            role="alertdialog"
            open
            header={{ heading: "Du må logge inn først" }}
            onClose={onCloseClick}
        >
            <Modal.Body>
                <VStack gap="6">
                    <BodyLong>
                        Du bruker BankID for å logge inn på <span translate="no">arbeidsplassen.no</span>
                    </BodyLong>
                    <HStack justify="center">
                        <FigureWithKey />
                    </HStack>
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                {onLoginClick ? (
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={onLoginClick}>
                        Logg inn
                    </Button>
                ) : (
                    <Button variant="primary" icon={<EnterIcon aria-hidden="true" />} onClick={onLoginClick}>
                        Logg inn
                    </Button>
                )}

                {onCloseClick && (
                    <Button variant="secondary" onClick={onCloseClick}>
                        Avbryt
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

LoginModal.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
};

export default LoginModal;
