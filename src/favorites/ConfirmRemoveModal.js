import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import {
    HIDE_MODAL_REMOVE_FROM_FAVORITES,
    REMOVE_FROM_FAVORITES
} from './favoritesReducer';
import './Favorites.less';

class ConfirmRemoveModal extends React.Component {
    onRemoveClick = () => {
        this.props.hideModal();
        this.props.removeFromFavorites(this.props.adAboutToBeRemoved.uuid);
    };

    closeModal = () => {
        this.props.hideModal();
    };

    render() {
        if (this.props.confirmationVisible) {
            return (
                <Modal
                    isOpen
                    onRequestClose={this.closeModal}
                    contentLabel="Slett favoritt"
                    appElement={document.getElementById('app')}
                >
                    <div className="Favorites__modal">
                        <Undertittel className="Favorites__modal__title">Slett favoritt</Undertittel>
                        <Normaltekst className="Favorites__modal__message">
                            Er du sikker på at du vil slette &#34;{this.props.adAboutToBeRemoved.title}&#34;?
                        </Normaltekst>
                        <div className="Favorites__modal__buttons">
                            <Hovedknapp onClick={this.onRemoveClick}>Slett</Hovedknapp>
                            <Flatknapp onClick={this.closeModal}>Avbryt</Flatknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

ConfirmRemoveModal.defaultProps = {
    adAboutToBeRemoved: undefined
};

ConfirmRemoveModal.propTypes = {
    removeFromFavorites: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired,
    confirmationVisible: PropTypes.bool.isRequired,
    adAboutToBeRemoved: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string
    })
};

const mapStateToProps = (state) => ({
    confirmationVisible: state.favorites.confirmationVisible,
    adAboutToBeRemoved: state.favorites.adAboutToBeRemoved
});

const mapDispatchToProps = (dispatch) => ({
    removeFromFavorites: (uuid) => dispatch({ type: REMOVE_FROM_FAVORITES, uuid }),
    hideModal: () => dispatch({ type: HIDE_MODAL_REMOVE_FROM_FAVORITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveModal);
