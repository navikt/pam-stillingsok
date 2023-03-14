import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../common/environment";
import getEmployer from "../../../../server/common/getEmployer";
import Alert from "../../../common/components/alert/Alert";
import Spinner from "nav-frontend-spinner";
import { Button } from "@navikt/ds-react";

function TrekkSoknadConfirmationRequired({ ad, handleWithDrawClick, isDeleting, hasError }) {
    return (
        <React.Fragment>
            <h1 className="InterestForm__h1">Bekreft at du ønsker å trekke din søknad</h1>
            <p className="InterestForm__p InterestForm__mb-2">
                Informasjonen du har oppgitt i din søknad vil bli slettet. Dette valget kan ikke angres og du må søke på
                nytt dersom du ønsker det.
            </p>
            {ad && (
                <div className="InterestMessageDelete__ad">
                    <p className="InterestMessageDelete__ad-title">
                        <Link to={`${CONTEXT_PATH}/stilling/${ad._id}`} className="link">
                            {ad._source.title}
                        </Link>
                    </p>
                    <p className="InterestForm__employer">{getEmployer(ad._source)}</p>
                </div>
            )}

            {hasError && (
                <div className="InterestForm__mb-2">
                    <Alert>
                        Det oppsto dessverre en feil og vi kunne ikke trekke søknaden din. Prøv å trekk søknaden på
                        nytt.
                    </Alert>
                </div>
            )}
            {isDeleting ? (
                <div aria-live="polite" className="InterestForm__progress">
                    <Spinner type="S" /> Trekker søknad
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
