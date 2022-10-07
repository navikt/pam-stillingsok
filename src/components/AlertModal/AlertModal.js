import PropTypes from "prop-types";
import React, { useRef } from "react";
import NavFrontendModal from "nav-frontend-modal";
import Button from "../Button/Button";
import "./AlertModal.less";

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
        <NavFrontendModal
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
                    className={useOnlyCancelButton ? "Button Button--primary" : "Button Button--secondary"}
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
        </NavFrontendModal>
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
