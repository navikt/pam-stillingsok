import React from "react";
import { Alert, BodyLong, Button, Modal } from "@navikt/ds-react";
import PropTypes from "prop-types";

function ConfirmBeforeUnPublish({ onClose, stilling, stopAd, status }) {
    return (
        <Modal
            width="medium"
            open
            onClose={() => onClose(false)}
            header={{
                label: stilling.overskrift,
                heading: "Bekreft at du ønsker å avpublisere annonsen",
            }}
        >
            <Modal.Body>
                <BodyLong>
                    Annonsen vil ikke lenger være synlig i søket og jobbsøkere kan ikke søke på stillingen. Du kan ikke
                    angre dette valget.
                </BodyLong>
                {status === "error" && (
                    <Alert variant="error" role="alert" className="mt-4">
                        Det oppsto en feil. Forsøk å avpublisere på en gang til, eller last inn nettsiden på nytt
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={stopAd} loading={status === "pending"}>
                    Avpubliser annonsen
                </Button>
                <Button variant="secondary" onClick={() => onClose(false)}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

ConfirmBeforeUnPublish.propTypes = {
    stilling: PropTypes.shape({
        overskrift: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    stopAd: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
};

export default ConfirmBeforeUnPublish;
