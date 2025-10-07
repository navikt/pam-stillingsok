import React, { useRef } from "react";
import { Alert, BodyLong, Button, Heading, Modal } from "@navikt/ds-react";

type AlertModalProps = {
    id: string;
    title: string;
    children: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    error?: boolean;
    errorHeading?: string;
    errorText?: string;
    label?: string | null;
    onConfirm?: () => void;
    onCancel: () => void;
    spinner?: boolean;
    useOnlyCancelButton?: boolean;
    showButtons?: boolean;
    width?: "medium" | "small" | number | `${number}${string}`;
};
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
}: AlertModalProps) {
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <Modal
            role="alertdialog"
            open
            onClose={onCancel}
            header={{ label: label ?? undefined, heading: title }}
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
