import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { HIDE_AUTHORIZATION_ERROR_MODAL } from './authenticationModalReducer';
import AuthorizationEnum from './AuthorizationEnum';
import './NotLoggedIn.less';
import { LOGIN_URL } from '../fasitProperties';

class NotLoggedIn extends React.Component {
    closeModal = () => {
        this.props.hideError();
    };

    onLoginClick = () => {
        window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
    };

    render() {
        if (this.props.isVisible) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Logg inn for å utføre handling"
                    appElement={document.getElementById('app')}

                >
                    <div className="NotLoggedIn">
                        {this.props.text === AuthorizationEnum.ADD_FAVORITE_ERROR && (
                            <Undertittel className="NotLoggedIn__title">
                                Du må logge inn for å lagre favoritter
                            </Undertittel>
                        )}
                        {this.props.text === AuthorizationEnum.SAVE_SEARCH_ERROR && (
                            <Undertittel className="NotLoggedIn__title">
                                Du må logge inn for å lagre søk
                            </Undertittel>
                        )}
                        <Normaltekst className="NotLoggedIn__message">
                            Logg inn med BankID, BankID på mobil, Buypass eller Commfides.
                        </Normaltekst>
                        <div className="NotLoggedIn__buttons">
                            <Hovedknapp onClick={this.onLoginClick}>Logg inn</Hovedknapp>
                            <Flatknapp onClick={this.closeModal}>Avbryt</Flatknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

NotLoggedIn.defaultProps = {
    text: AuthorizationEnum.ADD_FAVORITE_ERROR
};

NotLoggedIn.propTypes = {
    hideError: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    text: PropTypes.string
};

const mapStateToProps = (state) => ({
    text: state.authenticationModal.text,
    isVisible: state.authenticationModal.isVisible
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch({ type: HIDE_AUTHORIZATION_ERROR_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotLoggedIn);
