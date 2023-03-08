import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { BekreftCheckboksPanel } from "nav-frontend-skjema";
import { Button } from "@navikt/ds-react";
import CustomModal from "../../../common/components/modals/CustomModal";
import UserAPI from "../../../common/api/UserAPI";
import "./TermsOfUse.css";
import { UserContext } from "./UserProvider";
import { AuthenticationContext } from "../../auth/contexts/AuthenticationProvider";
import { FetchStatus } from "../../../common/hooks/useFetchReducer";
import useToggle from "../../../common/hooks/useToggle";
import Alert from "../../../common/components/alert/Alert";

function TermsOfUse({ onClose, onTermsAccepted }) {
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
            .catch(() => {
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
        <CustomModal onCloseClick={onClose} title={title} appElement={document.getElementById("app")}>
            {userNameAndInfo && userNameAndInfo.erUnderFemten ? (
                <div className="TermsOfUse">
                    <p className="TermsOfUse__section">
                        Du er under 15 år og er dessverre ikke gammel nok til å ha en profil på arbeidsplassen.no. Kom
                        gjerne tilbake igjen ved en senere anledning.
                    </p>
                    <div className="TermsOfUse__buttons">
                        <Button variant="primary" onClick={onClose}>Lukk</Button>
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
                            id="TermsOfUse__acceptButton"
                            variant="primary"
                            onClick={onAcceptTermsClick}
                            spinner={fetchStatus === FetchStatus.IS_FETCHING}
                            disabled={fetchStatus === FetchStatus.IS_FETCHING}
                        >
                            Jeg samtykker
                        </Button>
                        <Button variant="tertiary" onClick={onClose}>Avbryt</Button>
                    </div>
                </div>
            )}
        </CustomModal>
    );
}

TermsOfUse.defaultProps = {
    onTermsAccepted: undefined
};

TermsOfUse.propTypes = {
    onClose: PropTypes.func.isRequired,
    onTermsAccepted: PropTypes.func
};

export default TermsOfUse;
