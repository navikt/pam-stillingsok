import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import getEmployer from "../../../../server/common/getEmployer";
import { Alert, BodyLong, BodyShort, Button, Heading, Label, Loader } from "@navikt/ds-react";

function TrekkSoknadConfirmationRequired({ ad, handleWithDrawClick, isDeleting, hasError }) {
    return (
        <React.Fragment>
            <Heading level="1" size="xlarge" spacing>
                Bekreft at du ønsker å trekke din søknad
            </Heading>
            <BodyLong className="mb-2">
                Informasjonen du har oppgitt i din søknad vil bli slettet. Dette valget kan ikke angres og du må søke på
                nytt dersom du ønsker det.
            </BodyLong>
            {ad && (
                <div className="mb-2">
                    <BodyShort>
                        <Link to={`${CONTEXT_PATH}/stilling/${ad._id}`}>{ad._source.title}</Link>
                    </BodyShort>
                    <Label as="p">{getEmployer(ad._source)}</Label>
                </div>
            )}

            {hasError && (
                <Alert variant="error" className="mb-2">
                    Det oppsto dessverre en feil og vi kunne ikke trekke søknaden din. Prøv å trekk søknaden på nytt.
                </Alert>
            )}
            {isDeleting ? (
                <div aria-live="polite" className="InterestForm__progress">
                    <Loader size="small" /> Trekker søknad
                </div>
            ) : (
                <Button variant="primary" onClick={handleWithDrawClick} loading={isDeleting}>
                    Trekk søknad
                </Button>
            )}
        </React.Fragment>
    );
}

export default TrekkSoknadConfirmationRequired;
