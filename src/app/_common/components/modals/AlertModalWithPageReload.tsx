import React from "react";
import AlertModal from "./AlertModal";

type AlertModalWithPageReloadProps = {
    id: string;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};
export default function AlertModalWithPageReload({ id, title, children, onClose }: AlertModalWithPageReloadProps) {
    function handleReloadPageClick() {
        window.location.reload();
    }

    return (
        <AlertModal
            id={id}
            onCancel={onClose}
            onConfirm={handleReloadPageClick}
            title={title}
            confirmLabel="Last siden på nytt"
        >
            {children}
        </AlertModal>
    );
}
