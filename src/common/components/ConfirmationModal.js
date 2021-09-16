import Modal from 'nav-frontend-modal';
import { Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Flatknapp, Hovedknapp } from '@navikt/arbeidsplassen-knapper';
import './ConfirmationModal.less';

export default function ConfirmationModal({
    title, children, confirmLabel, cancelLabel, onConfirm, onCancel, spinner, useCancelButton
}) {
    return (
        <Modal
            isOpen
            onRequestClose={onCancel}
            contentLabel="Bekreft valg"
            appElement={document.getElementById('app')}
        >
            <div className="ConfirmationModal" role="alertdialog">
                <Undertittel className="ConfirmationModal__title">
                    {title}
                </Undertittel>
                <div className="ConfirmationModal__message typo-normal">
                    {children}
                </div>
                <div className="ConfirmationModal__buttons">
                    <Hovedknapp
                        spinner={spinner}
                        disabled={spinner}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Hovedknapp>
                    {useCancelButton && (
                        <Flatknapp
                            disabled={spinner}
                            onClick={onCancel}
                        >
                            {cancelLabel}
                        </Flatknapp>
                    )}
                </div>
            </div>
        </Modal>
    );
}

ConfirmationModal.defaultProps = {
    confirmLabel: 'Forsett',
    cancelLabel: 'Avbryt',
    spinner: false,
    useCancelButton: true
};

ConfirmationModal.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    useCancelButton: PropTypes.bool
};
