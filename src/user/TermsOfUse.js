import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Checkbox } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './TermsOfUse.less';
import { CREATE_USER, HIDE_TERMS_OF_USE_MODAL, SET_USER_TERMS_ACCEPTED } from './userReducer';
import Email from '../common/email/Email';

class TermsOfUse extends React.Component {
    onCheckboxClick = (e) => {
        this.props.setUserTermsAccepted(e.target.checked);
    };

    onAcceptTerms = () => {
        if (this.props.emailError === undefined) {
            this.props.createUser(this.props.email);
        }
    };

    closeModal = () => {
        this.props.hideModal();
    };

    render() {
        return (
            <Modal
                isOpen
                onRequestClose={this.closeModal}
                contentLabel="Ta i bruk innloggede tjenester"
                appElement={document.getElementById('app')}
            >
                <div className="TermsOfUse">
                    <Undertittel className="TermsOfUse__title">
                        Ta i bruk innloggede tjenester
                    </Undertittel>
                    <Normaltekst className="TermsOfUse__section">
                        Du må samtykke for å bruke innloggede tjenester i stillingssøk.
                    </Normaltekst>
                    <div className="TermsOfUse__section">
                        <Element>Vi lagrer:</Element>
                        <ul className="typo-normal">
                            <li>dine favoritter</li>
                            <li>søk med søkekriterier</li>
                            <li>e-postadresse (valgfritt)</li>
                        </ul>
                    </div>
                    <div className="TermsOfUse__section TermsOfUse__section--email">
                        <Element>E-post til lagrede søk</Element>
                        <Normaltekst>
                            Ønsker du å motta varslinger på et lagret søk trenger vi e-postadressen din.
                            Den vil bare bli brukt til dette formålet. Du kan senere velge å skru av
                            e-postvarsling under lagrede søk eller slette e-postadressen under dine innstillinger.
                        </Normaltekst>
                        <div className="TermsOfUse__input">
                            <Email
                                label="Oppgi e-post hvis du ønsker varsling (valgfritt)"
                            />
                        </div>
                    </div>
                    <div className="TermsOfUse__section TermsOfUse__section--last">
                        <Checkbox
                            name="terms"
                            label="Jeg samtykker til at Arbeidsplassen lagrer favoritter, søk og e-postadresse (valgfri)"
                            value="terms"
                            onChange={this.onCheckboxClick}
                            checked={this.props.termsAccepted}
                            feil={{
                                feilmelding: this.props.showUserTermsRequiredMessage ?
                                    'Du må huke av i avkryssingsboksen for å samtykke' : ''
                            }}
                        />
                        <Normaltekst>
                            Du kan trekke samtykket hvis du ikke lenger ønsker å bruke innloggede tjenester
                            i stillingssøket. Dette kan du gjøre under dine innstillinger.
                        </Normaltekst>
                    </div>
                    <div className="TermsOfUse__buttons">
                        <Hovedknapp
                            onClick={this.onAcceptTerms}
                            spinner={this.props.isCreating}
                            disabled={this.props.isCreating}
                        >
                            Jeg samtykker
                        </Hovedknapp>
                        <Flatknapp onClick={this.closeModal}>
                            Avbryt
                        </Flatknapp>
                    </div>
                </div>
            </Modal>
        );
    }
}

TermsOfUse.defaultProps = {
    emailError: undefined
};

TermsOfUse.propTypes = {
    setUserTermsAccepted: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
    termsAccepted: PropTypes.bool.isRequired,
    showUserTermsRequiredMessage: PropTypes.bool.isRequired,
    emailError: PropTypes.string,
    email: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    isCreating: state.user.isCreating,
    termsAccepted: state.user.termsAccepted,
    showUserTermsRequiredMessage: state.user.showUserTermsRequiredMessage,
    emailError: state.email.emailError,
    email: state.email.email
});

const mapDispatchToProps = (dispatch) => ({
    setUserTermsAccepted: (termsAccepted) => dispatch({ type: SET_USER_TERMS_ACCEPTED, termsAccepted }),
    createUser: (email) => dispatch({ type: CREATE_USER, email }),
    hideModal: () => dispatch({ type: HIDE_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
