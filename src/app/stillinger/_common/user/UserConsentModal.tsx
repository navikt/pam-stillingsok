import React, { ChangeEvent, useContext, useState } from "react";
import { Alert, BodyLong, Button, ConfirmationPanel, Modal } from "@navikt/ds-react";
import { AuthenticationContext } from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { FetchStatus } from "@/app/stillinger/_common/hooks/useFetchReducer";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import * as actions from "@/app/stillinger/_common/actions/index";
import { UserContext } from "./UserProvider";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type UserConsentModalProps = {
    onClose: () => void;
    onTermsAccepted?: () => void;
};
const UserConsentModal = ({ onClose, onTermsAccepted }: UserConsentModalProps) => {
    const { userNameAndInfo } = useContext(AuthenticationContext);
    const { updateUser } = useContext(UserContext);
    const [shouldShowError, showError, hideError] = useToggle();
    const [checked, check, uncheck] = useToggle();
    const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);

    async function createUser() {
        setFetchStatus(FetchStatus.IS_FETCHING);

        let isSuccess;
        let result;
        try {
            result = await actions.createUser({ acceptedTerms: "sok_v1" });
            if ("success" in result) {
                isSuccess = result.success;
            }
        } catch (err) {
            isSuccess = false;
        }

        if (isSuccess) {
            setFetchStatus(FetchStatus.SUCCESS);

            if (onTermsAccepted) {
                onTermsAccepted();
            }

            if (result && "data" in result) {
                updateUser(result.data);
            }
        } else {
            setFetchStatus(FetchStatus.FAILURE);
        }
    }

    function onCheckboxClick(e: ChangeEvent<HTMLInputElement>) {
        hideError();
        if (e.target.checked) {
            check();
        } else {
            uncheck();
        }
    }

    async function onAcceptTermsClick() {
        if (checked) {
            await createUser();
        } else {
            showError();
        }
    }

    const title =
        userNameAndInfo && userNameAndInfo.erUnderFemten
            ? "Du må nok vente litt til"
            : "Ta i bruk innloggede tjenester";

    return (
        <Modal width="medium" onClose={onClose} header={{ heading: title }} open>
            {userNameAndInfo && userNameAndInfo.erUnderFemten ? (
                <>
                    <Modal.Body>
                        <BodyLong>
                            Du er under 15 år og er dessverre ikke gammel nok til å ha en profil på arbeidsplassen.no.
                            Kom gjerne tilbake igjen ved en senere anledning.
                        </BodyLong>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={onClose}>
                            Lukk
                        </Button>
                    </Modal.Footer>
                </>
            ) : (
                <>
                    <Modal.Body>
                        <BodyLong spacing>Du må samtykke for å bruke innloggede tjenester i stillingssøk.</BodyLong>
                        <ConfirmationPanel
                            className="mb-8"
                            label="Jeg samtykker"
                            checked={checked}
                            onChange={onCheckboxClick}
                            error={shouldShowError ? "Du må huke av i avkryssingsboksen for å samtykke" : undefined}
                        >
                            <BodyLong spacing>
                                Vi lagrer dine favoritter, søk med kriterier og e-postadresse (valgfritt). Det er kun du
                                som kan se dette, og vi deler ikke informasjonen med andre. Anonymiserte data kan brukes
                                til statistikk.
                            </BodyLong>
                            <BodyLong>
                                Du kan når som helst trekke samtykket i innstillingene. Da slettes alle lagrede søk,
                                favoritter og eventuell e-postadresse du har oppgitt. Les mer i{" "}
                                <AkselNextLink href="/personvern" inlineText>
                                    arbeidsplassen.no sin personvernerklæring
                                </AkselNextLink>
                                .
                            </BodyLong>
                        </ConfirmationPanel>
                        {fetchStatus === FetchStatus.FAILURE && (
                            <Alert variant="error" className="mb-4 mt-4" role="alert">
                                Det oppsto en feil ved lagring av samtykke. Forsøk igjen.
                            </Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            id="TermsOfUse__acceptButton"
                            variant="primary"
                            onClick={onAcceptTermsClick}
                            loading={fetchStatus === FetchStatus.IS_FETCHING}
                        >
                            Jeg samtykker
                        </Button>
                        <Button variant="tertiary" onClick={onClose}>
                            Avbryt
                        </Button>
                    </Modal.Footer>
                </>
            )}
        </Modal>
    );
};

export default UserConsentModal;
