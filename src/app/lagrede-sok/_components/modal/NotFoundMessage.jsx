import React from "react";
import { Alert, BodyLong, Link as AkselLink, Modal } from "@navikt/ds-react";
import Link from "next/link";

function NotFoundMessage() {
    return (
        <Modal.Body>
            <Alert variant="warning" role="alert">
                Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.{" "}
                <AkselLink as={Link} href="/">
                    Last siden på nytt uten det gamle søket.
                </AkselLink>
            </Alert>
        </Modal.Body>
    );
}

export default NotFoundMessage;
