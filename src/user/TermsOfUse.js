import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Checkbox, Input } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './TermsOfUse.less';
import { CREATE_USER, SET_USER_TERMS_ACCEPTED } from './userReducer';

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

            if (this.props.redirectPage !== undefined && this.props.termsAccepted) {
                this.props.history.replace(this.props.redirectPage);
            }
        }
    };

    onEmailChange = (e) => {
        this.setState({
            email: e.target.value
        });
    };

    onEmailBlur = () => {
        this.setState({
            hasValidationError: this.state.email.length > 0 && this.state.email.indexOf('@') === -1
        });
    };

    onCancelClick = () => {
        this.props.onCancel();
    };

    render() {
        return (
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
                        <Input
                            label="Oppgi e-post hvis du ønsker varsling (valgfritt)"
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
                    <Flatknapp onClick={this.onCancelClick}>
                            Avbryt
                    </Flatknapp>
                </div>
            </div>
        );
    }
}

TermsOfUse.defaultProps = {
    redirectPage: undefined,
    history: undefined
};

TermsOfUse.propTypes = {
    setUserTermsAccepted: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
    termsAccepted: PropTypes.bool.isRequired,
    showUserTermsRequiredMessage: PropTypes.bool.isRequired,
    redirectPage: PropTypes.string,
    history: PropTypes.shape({
        replace: PropTypes.func
    })
};

const mapStateToProps = (state) => ({
    isCreating: state.user.isCreating,
    termsAccepted: state.user.termsAccepted,
    showUserTermsRequiredMessage: state.user.showUserTermsRequiredMessage
});

const mapDispatchToProps = (dispatch) => ({
    setUserTermsAccepted: (termsAccepted) => dispatch({ type: SET_USER_TERMS_ACCEPTED, termsAccepted }),
    createUser: (email) => dispatch({ type: CREATE_USER, email })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
