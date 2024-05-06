import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Alert, BodyLong, Button, Heading, Modal } from "@navikt/ds-react";

export default function AlertModal({
    id,
    title,
    children,
    confirmLabel = "Fortsett",
    cancelLabel = "Avbryt",
    error = false,
    errorHeading = "Det oppstod en feil",
    errorText = "Forsøk igjen eller last siden på nytt.",
    label,
    onConfirm,
    onCancel,
    spinner = false,
    useOnlyCancelButton = false,
    showButtons = true,
    width = "medium",
}) {
    const cancelButtonRef = useRef();

    return (
        <Modal
            role="alertdialog"
            open
            onClose={onCancel}
            header={{ label: label, heading: title }}
            aria-describedby={`${id}-message`}
            width={width}
        >
            <Modal.Body>
                <BodyLong id={`${id}-message`}>{children}</BodyLong>
                {error && (
                    <Alert variant="error" role="alert" className="mt-4">
                        <Heading level="2" size="xsmall" spacing>
                            {errorHeading}
                        </Heading>
                        {errorText}
                    </Alert>
                )}
            </Modal.Body>
            {showButtons && (
                <Modal.Footer>
                    {!useOnlyCancelButton && (
                        <Button variant="primary" loading={spinner} onClick={onConfirm}>
                            {confirmLabel}
                        </Button>
                    )}
                    <Button
                        ref={cancelButtonRef}
                        variant={useOnlyCancelButton ? "primary" : "secondary"}
                        disabled={spinner}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
}

AlertModal.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    confirmLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    error: PropTypes.bool,
    errorHeading: PropTypes.string,
    errorText: PropTypes.string,
    label: PropTypes.string,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    useOnlyCancelButton: PropTypes.bool,
    showButtons: PropTypes.bool,
    width: PropTypes.string,
};
