import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Alert, BodyLong, Button, TextField } from "@navikt/ds-react";
import { isValidEmail } from "../../../../common/utils/utils";
import { UserContext } from "../../../user/contexts/UserProvider";
import { FetchStatus } from "../../../../common/hooks/useFetchReducer";
import UserAPI from "../../../../common/api/UserAPI";

function RegisterEmailForm({ onClose, onSuccess }) {
    const { user, updateUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [saveStatus, setSaveStatus] = useState(FetchStatus.NOT_FETCHED);
    const [emailValidationError, setEmailValidationError] = useState(undefined);
    const emailRef = useRef();

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    function validateForm() {
        let isValid = true;

        if (email && email.length > 0 && !isValidEmail(email)) {
            isValid = false;
            setEmailValidationError(
                "E-postadressen er ugyldig. Den må minimum inneholde en «@» og et punktum. Den kan ikke inneholde noen mellomrom. For eksempel: navn.navnesen@gmail.com",
            );
        } else if (email === undefined || email === null || email.trim().length === 0) {
            isValid = false;
            setEmailValidationError("Du må skrive inn e-postadresse for å kunne få varsler på e-post");
        } else {
            setEmailValidationError(undefined);
        }
        if (!isValid) {
            emailRef.current.focus();
        }
        return isValid;
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        if (validateForm()) {
            setSaveStatus(FetchStatus.IS_FETCHING);

            UserAPI.put("api/v1/user", {
                ...user.data,
                email,
            })
                .then((response) => {
                    setSaveStatus(FetchStatus.SUCCESS);
                    updateUser(response);
                    onSuccess();
                })
                .catch(() => {
                    setSaveStatus(FetchStatus.FAILURE);
                });
        }
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailValidationError(undefined);
    }

    return (
        <>
            <BodyLong role="status" spacing>
                <span className="bold">Søket ditt er lagret, men du har ikke registrert e-postadresse.</span>
                <br />
                For å motta varsler på e-post må du registrere e-postadressen din.
            </BodyLong>
            <form onSubmit={handleFormSubmit}>
                <TextField
                    type="email"
                    label="Skriv inn e-postadressen din"
                    value={email || ""}
                    onChange={handleEmailChange}
                    ref={emailRef}
                    error={emailValidationError}
                />

                {saveStatus === FetchStatus.FAILURE && (
                    <Alert variant="error" className="mb-4 mt-4" role="alert">
                        Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt
                    </Alert>
                )}

                <div className="SaveSearchForm__buttons">
                    <Button
                        variant="primary"
                        type="submit"
                        loading={saveStatus === FetchStatus.IS_FETCHING}
                        disabled={saveStatus === FetchStatus.IS_FETCHING}
                    >
                        Lagre e-post
                    </Button>
                    <Button variant="secondary" type="button" onClick={onClose}>
                        Avbryt
                    </Button>
                </div>
            </form>
        </>
    );
}

RegisterEmailForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default RegisterEmailForm;
