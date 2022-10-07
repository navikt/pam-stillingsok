import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { BekreftCheckboksPanel } from "nav-frontend-skjema";
import Button from "../../components/Button/Button";
import { captureException } from "@sentry/browser";
import Modal from "../../components/Modal/Modal";
import UserAPI from "../../api/UserAPI";
import "./UserConsentModal.less";
import { UserContext } from "./UserProvider";
import { AuthenticationContext } from "../Authentication/AuthenticationProvider";
import { FetchStatus } from "../../hooks/useFetchReducer";
import useToggle from "../../hooks/useToggle";
import Alert from "../../components/Alert/Alert";

function UserConsentModal({ onClose, onTermsAccepted }) {
    const { userNameAndInfo } = useContext(AuthenticationContext);
    const { updateUser } = useContext(UserContext);
    const [shouldShowError, showError, hideError] = useToggle();
    const [checked, check, uncheck] = useToggle();
    const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);

    function createUser() {
        setFetchStatus(FetchStatus.IS_FETCHING);

        UserAPI.post("api/v1/user", {
            acceptedTerms: "sok_v1"
        })
            .then((response) => {
                setFetchStatus(FetchStatus.SUCCESS);
                if (onTermsAccepted) {
                    onTermsAccepted();
                }
                updateUser(response);
            })
            .catch((e) => {
                captureException(e);
                setFetchStatus(FetchStatus.FAILURE);
            });
    }

    function onCheckboxClick(e) {
        hideError();
        if (e.target.checked) {
            check();
        } else {
            uncheck();
        }
    }

    function onAcceptTermsClick() {
        if (checked) {
            createUser();
        } else {
            showError();
        }
    }

    const title =
        userNameAndInfo && userNameAndInfo.erUnderFemten
            ? "Du må nok vente litt til"
            : "Ta i bruk innloggede tjenester";

    return (
        <Modal onCloseClick={onClose} title={title} appElement={document.getElementById("app")}>
            {userNameAndInfo && userNameAndInfo.erUnderFemten ? (
                <div className="TermsOfUse">
                    <p className="TermsOfUse__section">
                        Du er under 15 år og er dessverre ikke gammel nok til å ha en profil på arbeidsplassen.no. Kom
                        gjerne tilbake igjen ved en senere anledning.
                    </p>
                    <div className="TermsOfUse__buttons">
                        <Button variant="primary" onClick={onClose}>
                            Lukk
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="TermsOfUse">
                    <p className="TermsOfUse__section">
                        Du må samtykke for å bruke innloggede tjenester i stillingssøk.
                    </p>
                    <BekreftCheckboksPanel
                        className="TermsOfUse__section"
                        label="Dine favoritter, søk og søkekriterier"
                        checked={checked}
                        onChange={onCheckboxClick}
                        inputProps={{ id: "TermsOfUse__checkbox" }}
                    >
                        Vi lagrer dine favoritter, søk med søkekriterier og e-postadresse (valgfri). Det er kun du som
                        kan se hva du har lagret.
                    </BekreftCheckboksPanel>
                    <p className="TermsOfUse__section TermsOfUse__section--last">
                        Du kan trekke samtykket hvis du ikke lenger ønsker å bruke de innloggede tjenestene. Dette kan
                        du gjøre under innstillinger.
                    </p>
                    {shouldShowError && (
                        <div role="alert">
                            <div className="skjemaelement__feilmelding blokk-s">
                                Du må huke av i avkryssingsboksen for å samtykke
                            </div>
                        </div>
                    )}
                    {fetchStatus === FetchStatus.FAILURE && (
                        <Alert>Det oppsto en feil ved lagring av samtykke. Forsøk igjen.</Alert>
                    )}
                    <div className="TermsOfUse__buttons">
                        <Button
                            variant="primary"
                            id="TermsOfUse__acceptButton"
                            onClick={onAcceptTermsClick}
                            spinner={fetchStatus === FetchStatus.IS_FETCHING}
                            disabled={fetchStatus === FetchStatus.IS_FETCHING}
                        >
                            Jeg samtykker
                        </Button>
                        <Button variant="flat" onClick={onClose}>
                            Avbryt
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

UserConsentModal.defaultProps = {
    onTermsAccepted: undefined
};

UserConsentModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onTermsAccepted: PropTypes.func
};

export default UserConsentModal;
