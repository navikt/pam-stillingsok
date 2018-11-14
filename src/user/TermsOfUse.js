import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './TermsOfUse.less';
import { CREATE_USER, HIDE_TERMS_OF_USE_MODAL } from './userReducer';

class TermsOfUse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    }

    onAcceptTerms = () => {
        this.props.createUser(this.state.email);
    };

    onEmailChange = (e) => {
        this.setState({
            email: e.target.value
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
                contentLabel="Vilkår for bruk av tjenesten"
                appElement={document.getElementById('app')}
            >
                <div className="TermsOfUse">
                    <Undertittel className="TermsOfUse__title">
                        Vilkår for å bruke innloggede tjenester
                    </Undertittel>
                    <Normaltekst className="TermsOfUse__text">
                        Du må samtykke for å bruke innloggede tjenester i stillingssøk. Hvis du gjør et
                        søk og vil lagre søkekriteriene under Lagrede søk, trenger vi en e-postadresse
                        som du vil motta stillingsannonser på. E-postadressen blir bare brukt til dette
                        formålet. Hvis du bare vil lagre en stilling som favoritt, behøver du ikke
                        registrere e-postadressen din.
                    </Normaltekst>
                    <div className="TermsOfUse__input">
                        <Input
                            label="E-postadressen din"
                            value={this.state.email}
                            onChange={this.onEmailChange}
                        />
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
                    <Normaltekst className="TermsOfUse__notes">
                        Du kan trekke samtykket ditt når som helst hvis du ikke lenger ønsker å
                        bruke innloggede tjenester i stillingssøket. Vilkårene og mulighet for å
                        trekke samtykket finner du igjen i Min side.
                        <br />E-posten benyttes bare til å varsle deg når nye stillinger dukker opp.
                        Du kan senere velge å skru av e-postvarsling under lagrede søk eller
                        slette e-postadressen på Min side.
                    </Normaltekst>
                </div>
            </Modal>
        );
    }
}

TermsOfUse.propTypes = {
    createUser: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isCreating: state.user.isCreating
});

const mapDispatchToProps = (dispatch) => ({
    createUser: (email) => dispatch({ type: CREATE_USER, email }),
    hideModal: () => dispatch({ type: HIDE_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
