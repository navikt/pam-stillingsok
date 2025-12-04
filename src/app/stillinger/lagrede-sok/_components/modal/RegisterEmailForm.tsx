import React, {
    ChangeEvent,
    FormEvent,
    MutableRefObject,
    ReactElement,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Alert, BodyLong, Button, TextField, Modal } from "@navikt/ds-react";
import { isValidEmail } from "@/app/stillinger/_common/utils/utils";
import { UserContext } from "@/app/stillinger/_common/user/UserProvider";
import { FetchStatus } from "@/app/stillinger/_common/hooks/useFetchReducer";
import * as actions from "@/app/stillinger/_common/actions";

interface RegisterEmailFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

function RegisterEmailForm({ onClose, onSuccess }: RegisterEmailFormProps): ReactElement {
    const { user, updateUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [saveStatus, setSaveStatus] = useState(FetchStatus.NOT_FETCHED);
    const [emailValidationError, setEmailValidationError] = useState<string | undefined>(undefined);
    const emailRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    function validateForm(): boolean {
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
            emailRef?.current?.focus();
        }
        return isValid;
    }

    async function handleFormSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();

        if (validateForm()) {
            setSaveStatus(FetchStatus.IS_FETCHING);
            let isSuccess;

            let result: { success: boolean; statusCode?: number; data?: any };

            const brukerMedEpost = user ? { ...user, email } : undefined;
            try {
                result = await actions.updateUser(brukerMedEpost);
                isSuccess = result.success;
            } catch (err) {
                isSuccess = false;
            }

            if (isSuccess) {
                setSaveStatus(FetchStatus.SUCCESS);
                updateUser(result!.data);
                onSuccess();
            } else {
                setSaveStatus(FetchStatus.FAILURE);
            }
        }
    }

    function handleEmailChange(e: ChangeEvent<HTMLInputElement>): void {
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
                    ref={emailRef as MutableRefObject<HTMLInputElement>}
                    error={emailValidationError}
                />

                {saveStatus === FetchStatus.FAILURE && (
                    <Alert variant="error" className="mb-4 mt-4" role="alert">
                        Noe gikk galt ved lagring, forsøk igjen eller last siden på nytt
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

export default RegisterEmailForm;
