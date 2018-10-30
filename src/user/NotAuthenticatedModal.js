import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AuthorizationEnum from './AuthorizationEnum';
import NotAuthenticated from './NotAuthenticated';
import './NotAuthenticatedModal.less';
import { HIDE_AUTHORIZATION_ERROR_MODAL } from './userReducer';

class NotAuthenticatedModal extends React.Component {
    closeModal = () => {
        this.props.hideError();
    };

    render() {
        let title;
        if (this.props.authorizationError === AuthorizationEnum.ADD_FAVORITE_ERROR) {
            title = 'Du må logge inn for å lagre favoritter';
        } else if (this.props.authorizationError === AuthorizationEnum.SAVE_SEARCH_ERROR) {
            title = 'Du må logge inn for å lagre søk';
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

NotAuthenticatedModal.defaultProps = {
    authorizationError: undefined
};

NotAuthenticatedModal.propTypes = {
    hideError: PropTypes.func.isRequired,
    authorizationError: PropTypes.string
};

const mapStateToProps = (state) => ({
    authorizationError: state.user.authorizationError
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch({ type: HIDE_AUTHORIZATION_ERROR_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotAuthenticatedModal);
