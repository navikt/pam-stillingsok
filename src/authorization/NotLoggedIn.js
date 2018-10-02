import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { HIDE_AUTHORIZATION_ERROR_MODAL } from './authorizationReducer';

class NotLoggedIn extends React.Component {

    closeModal = () => {
        this.props.hideError();
    };

    render() {
        if (this.props.authorizationError) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Logg inn for å utføre handling"
                    appElement={document.getElementById('app')}

                >
                    <div className="SavedSearchModal">
                        <Element>
                            {this.props.authorizationError}
                        </Element>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

NotLoggedIn.defaultProps = {
    authorizationError: undefined
};

NotLoggedIn.propTypes = {
    hideError: PropTypes.func.isRequired,
    authorizationError: PropTypes.string
};

const mapStateToProps = (state) => ({
    authorizationError: state.authorization.authorizationError
});

const mapDispatchToProps = (dispatch) => ({
    hideError: () => dispatch({ type: HIDE_AUTHORIZATION_ERROR_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotLoggedIn);