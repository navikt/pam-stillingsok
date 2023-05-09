import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { BodyLong, Heading, Modal } from "@navikt/ds-react";
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
    useOnlyCancelButton,
    showButtons
}) {
    const cancelButtonRef = useRef();

    useEffect(() => {
        Modal.setAppElement("#app");
    }, []);

    return (
        <Modal
            className="AlertModal"
            role="alertdialog"
            open={true}
            onClose={onCancel}
            aria-labelledby={`${id}-h1`}
            aria-describedby={`${id}-message`}
        >
            <Heading level="1" size="medium" id={`${id}-h1`} spacing>
                {title}
            </Heading>
            <BodyLong id={`${id}-message`} className="mb-2_5">
                {children}
            </BodyLong>
            {showButtons && (
                <div className="AlertModal__buttons">
                    <Button
                        ref={cancelButtonRef}
                        variant={useOnlyCancelButton ? "primary" : "secondary"}
                        loading={spinner}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                    {!useOnlyCancelButton && (
                        <Button variant="primary" loading={spinner} disabled={spinner} onClick={onConfirm}>
                            {confirmLabel}
                        </Button>
                    )}
                </div>
            )}
            
        </Modal>
    );
}

AlertModal.defaultProps = {
    confirmLabel: "Fortsett",
    cancelLabel: "Avbryt",
    spinner: false,
    useOnlyCancelButton: false,
    onConfirm: undefined,
    showButtons: false
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
    useOnlyCancelButton: PropTypes.bool,
    showButtons: PropTypes.bool
};
