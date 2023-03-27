import React from "react";
import { CONTEXT_PATH } from "../../../../common/environment";
import { BodyLong } from "@navikt/ds-react";

function NotFoundMessage() {
    return (
        <React.Fragment>
            <BodyLong role="alert">
                Det oppsto en feil. Det kan se ut som om du forsøker å oppdatere et lagret søk som ikke finnes lengre.{" "}
                <a href={CONTEXT_PATH}>Forsøk å laste siden på nytt uten det gamle søket.</a>
            </BodyLong>
        </React.Fragment>
    );
}

export default NotFoundMessage;
