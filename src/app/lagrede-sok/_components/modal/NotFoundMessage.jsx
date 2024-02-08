import React from "react";
import { BodyLong, Link as AkselLink, Modal } from "@navikt/ds-react";

function NotFoundMessage() {
    return (
        <Modal.Body>
            <BodyLong role="alert">
                Det oppsto en feil. Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.{" "}
                <AkselLink href="/">Forsøk å laste siden på nytt uten det gamle søket.</AkselLink>
            </BodyLong>
        </Modal.Body>
    );
}

export default NotFoundMessage;
