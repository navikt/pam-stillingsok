import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import Lenkeknapp from '../common/Lenkeknapp';
import {
    HIDE_MODAL_REMOVE_FROM_FAVOURITES,
    REMOVE_FROM_FAVOURITES
} from './favouritesReducer';

class ConfirmRemoveModal extends React.Component {
    onRemoveClick = () => {
        this.props.hideForm();
        this.props.removeFromFavourites(this.props.favouriteAboutToBeRemoved.uuid);
    };

    closeModal = () => {
        this.props.hideForm();
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
                    <div className="Favourites__modal">
                        <Undertittel className="Favourites__modal__title">Slett favoritt</Undertittel>
                        <Normaltekst className="Favourites__modal__message">
                            Er du sikker på at du vil slette &#34;{this.props.favouriteAboutToBeRemoved.favouriteAd.title}&#34;?
                        </Normaltekst>
                        <div className="Favourites__modal__buttons">
                            <Hovedknapp onClick={this.onRemoveClick}>Slett</Hovedknapp>
                            <Lenkeknapp onClick={this.closeModal}>Tilbake til favoritter</Lenkeknapp>
                        </div>
                    </div>
                </Modal>
            );
        }
        return null;
    }
}

ConfirmRemoveModal.defaultProps = {
    favouriteAboutToBeRemoved: undefined
};

ConfirmRemoveModal.propTypes = {
    removeFromFavourites: PropTypes.func.isRequired,
    hideForm: PropTypes.func.isRequired,
    confirmationVisible: PropTypes.bool.isRequired,
    favouriteAboutToBeRemoved: PropTypes.shape({
        uuid: PropTypes.string,
        favouriteAd: PropTypes.shape({
            title: PropTypes.string
        })
    })
};

const mapStateToProps = (state) => ({
    confirmationVisible: state.favourites.confirmationVisible,
    favouriteAboutToBeRemoved: state.favourites.favouriteAboutToBeRemoved
});

const mapDispatchToProps = (dispatch) => ({
    removeFromFavourites: (uuid) => dispatch({ type: REMOVE_FROM_FAVOURITES, uuid }),
    hideForm: () => dispatch({ type: HIDE_MODAL_REMOVE_FROM_FAVOURITES })
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveModal);
