import AlertStripe from 'nav-frontend-alertstriper';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
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
            <Modal
                isOpen
                onRequestClose={this.closeModal}
                contentLabel="Slett konto"
                appElement={document.getElementById('app')}
            >
                <div className="SavedSearchModal">
                    {this.props.deleteUserError && (
                        <AlertStripe solid type="advarsel" className="blokk-m">
                            Det oppsto en feil ved sletting av bruker. Forsøk å laste siden på nytt
                        </AlertStripe>
                    )}
                    <Undertittel className="SavedSearchModal__title">
                        Er du sikker på at du vil slette din bruker?
                    </Undertittel>
                    <div className="SavedSearchModal__body">
                        <Normaltekst>
                            Når du sletter brukeren, sletter du også alle dine favoritter og lagrede søk.
                            Har du valgt å motta varslinger på e-post, så vil du ikke lenger motta disse.
                        </Normaltekst>
                    </div>
                    <div className="SavedSearchModal__buttons">
                        <Hovedknapp
                            spinner={this.props.isDeletingUser}
                            disabled={this.props.isDeletingUser}
                            onClick={this.onRemoveClick}
                        >
                            Slett bruker
                        </Hovedknapp>
                        <Flatknapp onClick={this.closeModal}>Avbryt</Flatknapp>
                    </div>
                </div>
            </Modal>
        );
    }
}

ConfirmDeleteUserModal.defaultProps = {
    deleteUserError: undefined
};

ConfirmDeleteUserModal.propTypes = {
    deleteUser: PropTypes.func.isRequired,
    isDeletingUser: PropTypes.bool.isRequired,
    hideForm: PropTypes.func.isRequired,
    deleteUserError: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    deleteUserError: state.user.deleteUserError,
    isDeletingUser: state.user.isDeletingUser
});

const mapDispatchToProps = (dispatch) => ({
    deleteUser: () => dispatch({ type: DELETE_USER }),
    hideForm: () => dispatch({ type: HIDE_CONFIRM_DELETE_USER_MODAL })
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteUserModal);
