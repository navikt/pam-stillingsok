import React, { useContext, useState } from "react";
import { Input } from "nav-frontend-skjema";
import {captureException} from "@sentry/browser";
import { isValidEmail } from "../../../components/utils";
import { UserContext } from "../../../context/UserProvider";
import { Hovedknapp, Knapp } from "@navikt/arbeidsplassen-knapper";
import CustomModal from "../../../components/modals/CustomModal";
import { adUserApiPut } from "../../../api/aduser/adUserApi";
import { FetchStatus } from "../../../hooks/useFetchReducer";
import Alert from "../../../components/alert/Alert";

function RegisterEmailModal({ onClose }) {
    const { user, updateUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [saveStatus, setSaveStatus] = useState(FetchStatus.NOT_FETCHED);
    const [emailValidationError, setEmailValidationError] = useState(undefined);
    let emailRef;

    function handleFormSubmit(e) {
        e.preventDefault();

        if (validateForm()) {
            setSaveStatus(FetchStatus.IS_FETCHING);

            adUserApiPut("api/v1/user", {
                ...user.data,
                email: email
            })
                .then(response => {
                    setSaveStatus(FetchStatus.SUCCESS);
                    updateUser(response);
                })
                .catch(err => {
                    captureException(err);
                    setSaveStatus(FetchStatus.FAILURE);
                });
        }
    }

    function validateForm() {
        let isValid = true;

        if (email && email.length > 0 && !isValidEmail(email)) {
            isValid = false;
            setEmailValidationError(
                "E-postadressen er ugyldig. Den må minimum inneholde en «@» og et punktum. Den kan ikke inneholde noen mellomrom. For eksempel: navn.navnesen@gmail.com"
            );
        } else if (email === undefined || email === null || email.trim().length === 0) {
            isValid = false;
            setEmailValidationError("Du må skrive inn e-postadresse for å kunne få varsler på e-post");
        } else {
            setEmailValidationError(undefined);
        }
        if (!isValid) {
            emailRef.focus();
        }
        return isValid;
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailValidationError(undefined);
    }

    return (
        <CustomModal onCloseClick={onClose} title="Legg til e-postadresse">
            {saveStatus !== FetchStatus.SUCCESS ? (
                <React.Fragment>
                    <p className="SavedSearchModal__p">
                        <b>Du har ikke registrert e-postadresse.</b>
                        <br /> For å motta varsler på e-post må du registrere e-postadressen din.
                    </p>
                    <form onSubmit={handleFormSubmit}>
                        <Input
                            type="email"
                            label="Skriv inn e-postadressen din"
                            value={email || ""}
                            onChange={handleEmailChange}
                            inputRef={(el) => {
                                emailRef = el;
                            }}
                            feil={
                                emailValidationError
                                    ? {
                                          feilmelding: emailValidationError
                                      }
                                    : undefined
                            }
                        />

                        {saveStatus === FetchStatus.FAILURE && (
                            <Alert>Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt</Alert>
                        )}

                        <div className="SaveSearchForm__buttons">
                            <Hovedknapp
                                htmlType="submit"
                                spinner={saveStatus === FetchStatus.IS_FETCHING}
                                disabled={saveStatus === FetchStatus.IS_FETCHING}
                            >
                                Lagre
                            </Hovedknapp>
                            <Knapp htmlType="button" onClick={onClose}>
                                Avbryt
                            </Knapp>
                        </div>
                    </form>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <p className="SavedSearchModal__p">
                        Du må bekrefte e-postadressen din. Klikk på lenken i e-posten du har mottatt.
                    </p>
                    <Knapp onClick={onClose}>Lukk</Knapp>
                </React.Fragment>
            )}
        </CustomModal>
    );
}

export default RegisterEmailModal;
