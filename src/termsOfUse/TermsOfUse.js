import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Checkbox } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './TermsOfUse.less';
import { ACCEPT_TERMS, HIDE_TERMS_OF_USE_MODAL } from './termsOfUseReducer';

class TermsOfUse extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    onCheckboxChange = () => {
        this.setState({ checked: !this.state.checked });
    };

    onAcceptTerms = () => {
        this.props.acceptTerms();
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
                        Du er i ferd med å bruke en innlogget tjeneste
                    </Undertittel>
                    <Normaltekst className="TermsOfUse__text">
                        For å gå videre må du samtykke til at vi får lov til å innhente og behandle persondata
                        om deg.
                    </Normaltekst>
                    <div className="TermsOfUse__checkbox">
                        <Checkbox
                            label="Ja, jeg samtykker"
                            checked={this.state.checked}
                            onChange={this.onCheckboxChange}
                        />
                    </div>
                    <div className="TermsOfUse__buttons">
                        <Hovedknapp disabled={!this.state.checked} onClick={this.onAcceptTerms}>
                            Fortsett
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
    acceptTerms: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
    acceptTerms: () => dispatch({ type: ACCEPT_TERMS }),
    hideModal: () => dispatch({ type: HIDE_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
