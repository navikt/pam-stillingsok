import Modal from 'nav-frontend-modal';
import { Input, BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import './TermsOfUse.less';
import { CREATE_USER, HIDE_TERMS_OF_USE_MODAL, SET_USER_TERMS_ACCEPTED } from './userReducer';
import { isValidEmail } from '../utils';

class TermsOfUse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            hasValidationError: false
        };
    }

    onCheckboxClick = (e) => {
        this.props.setUserTermsAccepted(e.target.checked);
    };

    onAcceptTerms = () => {
        if (this.state.hasValidationError === false) {
            this.props.createUser(this.state.email);
        }
    };

    onEmailChange = (e) => {
        this.setState({
            email: e.target.value
        });
    };

    onEmailBlur = () => {
        this.setState({
            hasValidationError: this.state.email.length > 0 && !isValidEmail(this.state.email)
        });
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
                    <BekreftCheckboksPanel
                        className="TermsOfUse__section"
                        label="Dine favoritter, søk og søkekriterier"
                        checked={this.props.termsAccepted}
                        onChange={this.onCheckboxClick}
                        inputProps={{ id: 'TermsOfUse__checkbox' }}
                    >
                        <Normaltekst>
                            Vi lagrer dine favoritter, søk med søkekriterier og e-postadresse (valgfri).
                            Det er kun du som kan se hva du har lagret.
                        </Normaltekst>
                    </BekreftCheckboksPanel>
                    <div className="TermsOfUse__section TermsOfUse__section--email">
                        <Element>E-postvarslinger for lagrede søk</Element>
                        <Normaltekst>
                            Du kan motta varslinger på lagrede søk.
                            E-postadressen din vil bare bli brukt til dette formålet.
                        </Normaltekst>
                        <div className="TermsOfUse__input">
                            <Input
                                id="TermsOfUse__email"
                                label="E-post for å motta treff på mine lagrede søk"
                                value={this.state.email}
                                onChange={this.onEmailChange}
                                onBlur={this.onEmailBlur}
                                feil={this.state.hasValidationError ? {
                                    feilmelding: 'E-postadressen er ugyldig. Den må minimum inneholde en «@»'
                                } : undefined}
                            />
                        </div>
                    </div>
                    <div className="TermsOfUse__section TermsOfUse__section--last">
                        <Normaltekst>
                            Du kan trekke samtykket hvis du ikke lenger ønsker å bruke de innloggede tjenestene.
                            Dette kan du gjøre under innstillinger.
                        </Normaltekst>
                    </div>
                    {this.props.showUserTermsRequiredMessage && (
                        <div role="alert" aria-live="assertive">
                            <div className="skjemaelement__feilmelding blokk-s">
                                Du må huke av i avkryssingsboksen for å samtykke
                            </div>
                        </div>
                    )}
                    <div className="TermsOfUse__buttons">
                        <Hovedknapp
                            id="TermsOfUse__acceptButton"
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

TermsOfUse.propTypes = {
    setUserTermsAccepted: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
    termsAccepted: PropTypes.bool.isRequired,
    showUserTermsRequiredMessage: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isCreating: state.user.isCreating,
    termsAccepted: state.user.termsAccepted,
    showUserTermsRequiredMessage: state.user.showUserTermsRequiredMessage
});

const mapDispatchToProps = (dispatch) => ({
    setUserTermsAccepted: (termsAccepted) => dispatch({ type: SET_USER_TERMS_ACCEPTED, termsAccepted }),
    createUser: (email) => dispatch({ type: CREATE_USER, email }),
    hideModal: () => dispatch({ type: HIDE_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
