import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { HIDE_AUTHENTICATION_REQUIRED_MODAL } from './authenticationReducer';
import AuthenticationCaller from './AuthenticationCaller';
import NotAuthenticated from './NotAuthenticated';
import './NotAuthenticatedModal.less';

class NotAuthenticatedModal extends React.Component {
    closeModal = () => {
        this.props.hideError();
    };

    render() {
        let title;
        if (this.props.authenticationRequiredTitle === AuthenticationCaller.ADD_FAVORITE) {
            title = 'Du må logge inn for å lagre favoritter';
        } else if (this.props.authenticationRequiredTitle === AuthenticationCaller.SAVE_SEARCH) {
            title = 'Du må logge inn for å lagre søk';
        } else {
            title = 'Du må logge inn';
        }

        return (
            <Modal
                isOpen
                onRequestClose={this.closeModal}
                contentLabel="Logg inn for å utføre handling"
                appElement={document.getElementById('app')}

            >
                <div className="NotAuthenticatedModal">
                    <NotAuthenticated title={title} onCancel={this.closeModal} />
                </div>
            </Modal>
        );
    }
}


NotAuthenticatedModal.propTypes = {
    hideError: PropTypes.func.isRequired,
    authenticationRequiredTitle: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    authenticationRequiredTitle: state.authentication.authenticationRequiredTitle
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch({ type: HIDE_AUTHENTICATION_REQUIRED_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotAuthenticatedModal);
