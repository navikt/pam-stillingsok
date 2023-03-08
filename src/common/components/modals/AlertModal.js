import PropTypes from "prop-types";
import React, { useRef } from "react";
import Modal from "nav-frontend-modal";
import { Button } from "@navikt/ds-react";
import "./AlertModal.css";

export default function AlertModal({
    id,
    title,
    children,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
    spinner,
    useOnlyCancelButton
}) {
    const cancelButtonRef = useRef();

    return (
        <Modal
            appElement={document.getElementById("app")}
            className="AlertModal"
            role="alertdialog"
            isOpen
            onRequestClose={onCancel}
            onAfterOpen={() => {
                cancelButtonRef.current.focus();
            }}
            aria={{
                labelledby: `${id}-h1`,
                describedby: `${id}-message`
            }}
        >
            <h1 id={`${id}-h1`} className="AlertModal__h1">
                {title}
            </h1>
            <p id={`${id}-message`} className="AlertModal__message">
                {children}
            </p>
            <div className="AlertModal__buttons">
                <button
                    ref={cancelButtonRef}
                    className={useOnlyCancelButton ? "Knapp Knapp--hoved" : "Knapp"}
                    disabled={spinner}
                    onClick={onCancel}
                >
                    {cancelLabel}
                </button>
                {!useOnlyCancelButton && (
                    <Button variant="primary" spinner={spinner} disabled={spinner} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                )}
            </div>
        </Modal>
    );
}

AlertModal.defaultProps = {
    confirmLabel: "Fortsett",
    cancelLabel: "Avbryt",
    spinner: false,
    useOnlyCancelButton: false,
    onConfirm: undefined
};

AlertModal.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    useOnlyCancelButton: PropTypes.bool
};
