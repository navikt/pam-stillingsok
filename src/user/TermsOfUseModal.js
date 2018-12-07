import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { HIDE_TERMS_OF_USE_MODAL } from './userReducer';
import TermsOfUse from './TermsOfUse';

class TermsOfUseModal extends React.Component {
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
                <TermsOfUse
                    onCancel={this.closeModal}
                />
            </Modal>
        );
    }
}

TermsOfUseModal.propTypes = {
    hideModal: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    hideModal: () => dispatch({ type: HIDE_TERMS_OF_USE_MODAL })
});

export default connect(null, mapDispatchToProps)(TermsOfUseModal);
