import Modal from 'nav-frontend-modal';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { useEffect, useState } from 'react';
import { Flatknapp, Hovedknapp } from '@navikt/arbeidsplassen-knapper';
import './TermsOfUse.less';
import UnderFifteenInfo from "../underFifteenInfo/UnderFifteenInfo";
import { userApiPost } from '../api/userApi';
import { AD_USER_API } from '../fasitProperties';
import { connect } from 'react-redux';
import ConfirmationModal from '../common/components/ConfirmationModal';

function TermsOfUseNew({ onUserCreated, onCancel, erUnderFemten }) {
    const [response, setResponse] = useState({
        user: undefined,
        error: undefined,
        isPending: false
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showUserTermsRequiredMessage, setShowUserTermsRequiredMessage] = useState(false);
    const [saveAttempt, setSaveAttempt] = useState(0);

    useEffect(() => {
        let canceled = false;

        if(saveAttempt > 0) {
            setResponse((prev) => ({
               ...prev,
               isPending: true,
               error: undefined,
               user: undefined
            }));

            userApiPost(`${AD_USER_API}/api/v1/user`, { acceptedTerms: 'sok_v1', email: null }).then(
                (data) => {
                    if (!canceled) {
                        setResponse((prev) => ({
                            ...prev,
                            user: data,
                            isPending: false
                        }));
                        onUserCreated()
                    }
                }, (error) => {
                    setResponse((prev) => ({
                        ...prev,
                        isPending: false,
                        error: error
                    }));
                }
            )
        }

        return () => {
            canceled = true;
        }
    }, [saveAttempt])

    function createUser() {
        setSaveAttempt((prev) => (prev + 1));
    }

    const onCheckboxClick = (e) => {
        setTermsAccepted(e.target.checked);
        if (e.target.checked) {
            setShowUserTermsRequiredMessage(false);
        }
    };

    const onAcceptTerms = () => {
        if (termsAccepted) {
            createUser();
        } else {
            setShowUserTermsRequiredMessage(true);
        }
    };

    const closeModal = () => {
        onCancel();
    };

    const onErrorDialogClose = () => {
        setResponse((prev) => ({
            ...prev,
            error: undefined
        }));
    }

    return (
        <Modal
            isOpen
            onRequestClose={closeModal}
            contentLabel="Ta i bruk innloggede tjenester"
            appElement={document.getElementById('app')}
        >
            {response.error && (
                <ConfirmationModal
                    title="Det oppsto en feil"
                    useCancelButton={false}
                    onConfirm={onErrorDialogClose}
                    onCancel={onErrorDialogClose}
                    confirmLabel="Lukk"
                >
                    Forsøk å godta vilkår på nytt. Eller last siden inn en gang til.
                </ConfirmationModal>
            )}

            {erUnderFemten ? (
                <div className="TermsOfUse" role="alertdialog">
                    <UnderFifteenInfo knapperad={false}/>
                    <div className="TermsOfUse__buttons">
                        <Hovedknapp onClick={closeModal}>
                            Lukk
                        </Hovedknapp>
                    </div>
                </div>
            ) : (
                <div className="TermsOfUse">
                    <Undertittel className="TermsOfUse__title">
                        Ta i bruk innloggede tjenester
                    </Undertittel>
                    <Normaltekst className="TermsOfUse__section">
                        Du må samtykke for å bruke innloggede tjenester i stillingssøk.
                    </Normaltekst>
                    <BekreftCheckboksPanel
                        className="TermsOfUse__section"
                        label="Dine favoritter, søk og søkekriterier"
                        checked={termsAccepted}
                        onChange={onCheckboxClick}
                        inputProps={{ id: 'TermsOfUse__checkbox' }}
                    >
                        <Normaltekst>
                            Vi lagrer dine favoritter, søk med søkekriterier og e-postadresse (valgfri).
                            Det er kun du som kan se hva du har lagret.
                        </Normaltekst>
                    </BekreftCheckboksPanel>
                    <div className="TermsOfUse__section TermsOfUse__section--last">
                        <Normaltekst>
                            Du kan trekke samtykket hvis du ikke lenger ønsker å bruke de innloggede tjenestene.
                            Dette kan du gjøre under innstillinger.
                        </Normaltekst>
                    </div>
                    {showUserTermsRequiredMessage && (
                        <div role="alert" aria-live="assertive">
                            <div className="skjemaelement__feilmelding blokk-s">
                                Du må huke av i avkryssingsboksen for å samtykke
                            </div>
                        </div>
                    )}
                    <div className="TermsOfUse__buttons">
                        <Hovedknapp
                            id="TermsOfUse__acceptButton"
                            onClick={onAcceptTerms}
                            spinner={response.isPending}
                            disabled={response.isPending}
                        >
                            Jeg samtykker
                        </Hovedknapp>
                        <Flatknapp onClick={closeModal}>
                            Avbryt
                        </Flatknapp>
                    </div>
                </div>
            )}
        </Modal>
    );
}

const mapStateToProps = (state) => ({
    erUnderFemten: state.user.erUnderFemten
});

export default connect(mapStateToProps)(TermsOfUseNew);
