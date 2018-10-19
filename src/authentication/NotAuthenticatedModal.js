import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { HIDE_AUTHORIZATION_ERROR_MODAL } from './authenticationModalReducer';
import AuthorizationEnum from './AuthorizationEnum';
import './NotAuthenticatedModal.less';
import { LOGIN_URL } from '../fasitProperties';

function NotAuthenticatedModal({ text, closeModal }) {
    return (
        <Modal
            isOpen
            onRequestClose={closeModal}
            contentLabel="Logg inn for å utføre handling"
            appElement={document.getElementById('app')}

        >
            <div className="NotAuthenticatedModal">
                {text === AuthorizationEnum.ADD_FAVORITE_ERROR && (
                    <Undertittel className="NotAuthenticatedModal__title">
                        Du må logge inn for å lagre favoritter
                    </Undertittel>
                )}
                {text === AuthorizationEnum.SAVE_SEARCH_ERROR && (
                    <Undertittel className="NotAuthenticatedModal__title">
                        Du må logge inn for å lagre søk
                    </Undertittel>
                )}
                <Normaltekst className="NotAuthenticatedModal__message">
                    Logg inn med BankID, BankID på mobil, Buypass eller Commfides.
                </Normaltekst>
                <div className="NotAuthenticatedModal__buttons">
                    <a href={`${LOGIN_URL}?redirect=${window.location.href}`} className="knapp knapp--hoved">
                        Logg inn
                    </a>
                    <Flatknapp onClick={closeModal}>Avbryt</Flatknapp>
                </div>
            </div>
        </Modal>
    );
}

NotAuthenticatedModal.defaultProps = {
    text: AuthorizationEnum.ADD_FAVORITE_ERROR
};

NotAuthenticatedModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    text: PropTypes.string
};

const mapStateToProps = (state) => ({
    text: state.authenticationModal.text
});

const mapDispatchToProps = (dispatch) => ({
    closeModal: () => dispatch({ type: HIDE_AUTHORIZATION_ERROR_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotAuthenticatedModal);
