import React from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";

function NotFoundMessage({ onClose }) {
    return (
        <>
            <Modal.Body>
                <BodyLong spacing>
                    Det ser ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre. Forsøk å laste siden
                    på nytt.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" as="a" href="/stillinger">
                    Last siden på nytt
                </Button>
                <Button variant="secondary" type="submit" onClick={onClose}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </>
    );
}

export default NotFoundMessage;
