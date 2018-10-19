import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Checkbox } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import './TermsOfUse.less';
import { CREATE_USER } from '../user/userReducer';
import {
    SET_ACCEPT_TERMS_CHECKBOX_VALUE,
    HIDE_TERMS_OF_USE_MODAL,
    SHOW_TERMS_OF_USE_ERROR
} from './termsOfUseReducer';

class TermsOfUse extends React.Component {
    onCheckboxChange = (e) => {
        this.props.setAcceptTermsCheckboxValue(e.target.checked);
    };

    onConfirmClick = () => {
        if (this.props.acceptTermsCheckboxIsChecked) {
            this.props.hideModal();
            this.props.createUser();
        } else {
            this.props.showError();
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
                            checked={this.props.acceptTermsCheckboxIsChecked}
                            onChange={this.onCheckboxChange}
                            feil={this.props.validationError ?
                                { feilmelding: 'Du må godta vilkårene for å kunne forsette' } :
                                undefined
                            }
                        />
                    </div>
                    <div className="TermsOfUse__buttons">
                        <Hovedknapp onClick={this.onConfirmClick}>
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
    createUser: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    validationError: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    setAcceptTermsCheckboxValue: PropTypes.func.isRequired,
    acceptTermsCheckboxIsChecked: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    validationError: state.termsOfUse.validationError,
    acceptTermsCheckboxIsChecked: state.termsOfUse.acceptTermsCheckboxIsChecked
});

const mapDispatchToProps = (dispatch) => ({
    showError: () => dispatch({ type: SHOW_TERMS_OF_USE_ERROR }),
    createUser: () => dispatch({ type: CREATE_USER }),
    setAcceptTermsCheckboxValue: (checked) => dispatch({ type: SET_ACCEPT_TERMS_CHECKBOX_VALUE, checked }),
    hideModal: () => dispatch({ type: HIDE_TERMS_OF_USE_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
