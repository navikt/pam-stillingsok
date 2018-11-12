import AlertStripe from 'nav-frontend-alertstriper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ConfirmationModal from '../common/ConfirmationModal';
import { DELETE_USER, HIDE_CONFIRM_DELETE_USER_MODAL } from './userReducer';

class ConfirmDeleteUserModal extends React.Component {
    onRemoveClick = () => {
        this.props.deleteUser();
    };

    closeModal = () => {
        this.props.hideForm();
    };

    render() {
        return (
            <ConfirmationModal
                title="Er du sikker på at du vil slette din bruker?"
                onConfirm={this.onRemoveClick}
                onCancel={this.closeModal}
                confirmLabel="Slett bruker"
                spinner={this.props.isDeletingUser}
            >
                Når du sletter brukeren, sletter du også alle dine favoritter og lagrede søk.
                Har du valgt å motta varslinger på e-post, så vil du ikke lenger motta disse.
            </ConfirmationModal>
        );
    }
}

ConfirmDeleteUserModal.propTypes = {
    deleteUser: PropTypes.func.isRequired,
    isDeletingUser: PropTypes.bool.isRequired,
    hideForm: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isDeletingUser: state.user.isDeletingUser
});

const mapDispatchToProps = (dispatch) => ({
    deleteUser: () => dispatch({ type: DELETE_USER }),
    hideForm: () => dispatch({ type: HIDE_CONFIRM_DELETE_USER_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteUserModal);
