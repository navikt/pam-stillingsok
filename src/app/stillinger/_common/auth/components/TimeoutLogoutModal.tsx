import React from "react";
import { Button, Modal } from "@navikt/ds-react";
import Utlogget from "@/app/(artikler)/utlogget/Utlogget";

interface TimeoutLogoutModalProps {
    onClose: () => void;
}

const TimeoutLogoutModal = ({ onClose }: TimeoutLogoutModalProps) => {
    return (
        <>
            <Modal width="small" role="alertdialog" header={{ heading: "Du er nå logget ut" }} open onClose={onClose}>
                <Modal.Body>
                    <Utlogget timeout />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onClose}>
                        Lukk
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TimeoutLogoutModal;
