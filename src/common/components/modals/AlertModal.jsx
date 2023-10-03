import PropTypes from "prop-types";
import React, { useRef } from "react";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";

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
    showButtons,
}) {
    const cancelButtonRef = useRef();

    return (
        <Modal
            role="alertdialog"
            open
            onClose={onCancel}
            aria-labelledby={`${id}-h1`}
            aria-describedby={`${id}-message`}
        >
            <Modal.Header>
                <Heading level="1" size="medium" id={`${id}-h1`} spacing>
                    {title}
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyLong id={`${id}-message`}>{children}</BodyLong>
            </Modal.Body>
            {showButtons && (
                <Modal.Footer>
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
                </Modal.Footer>
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
    showButtons: true,
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
    showButtons: PropTypes.bool,
};
