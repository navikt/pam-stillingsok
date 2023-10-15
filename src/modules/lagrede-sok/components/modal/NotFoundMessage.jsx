import React from "react";
import { BodyLong, Link as AkselLink, Modal } from "@navikt/ds-react";
import { CONTEXT_PATH } from "../../../common/environment";

function NotFoundMessage() {
    return (
        <Modal.Body>
            <BodyLong role="alert">
                Det oppsto en feil. Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.{" "}
                <AkselLink href={CONTEXT_PATH}>Forsøk å laste siden på nytt uten det gamle søket.</AkselLink>
            </BodyLong>
        </Modal.Body>
    );
}

export default NotFoundMessage;
