import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Alert, BodyLong, Button, TextField, Modal } from "@navikt/ds-react";
import { isValidEmail } from "@/app/_common/utils/utils";
import { UserContext } from "@/app/_common/user/UserProvider";
import { FetchStatus } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import isBrowserAndHasNetwork from "@/app/_common/utils/isBrowserAndHasNetwork";

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

    async function handleFormSubmit(e) {
        e.preventDefault();

        if (!isBrowserAndHasNetwork) {
            setSaveStatus(FetchStatus.NO_NETWORK);
        } else if (validateForm()) {
            setSaveStatus(FetchStatus.IS_FETCHING);
            const result = await actions.updateUser({ ...user, email });
            if (result.success) {
                setSaveStatus(FetchStatus.SUCCESS);
                updateUser(result.data);
                onSuccess();
            } else {
                setSaveStatus(FetchStatus.FAILURE);
            }
        }
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailValidationError(undefined);
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <Modal.Body>
                <div role="status">
                    <BodyLong weight="semibold">
                        Søket ditt er lagret, men du har ikke registrert e-postadresse.
                    </BodyLong>
                    <BodyLong spacing>For å motta varsler på e-post må du registrere e-postadressen din.</BodyLong>
                </div>
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
                        Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt.
                    </Alert>
                )}

                {saveStatus === FetchStatus.NO_NETWORK && (
                    <Alert variant="error" className="mb-4 mt-4" role="alert">
                        Noe gikk galt ved lagring, sjekk nettforbindelsen din og prøv igjen.
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
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
            </Modal.Footer>
        </form>
    );
}

RegisterEmailForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default RegisterEmailForm;
