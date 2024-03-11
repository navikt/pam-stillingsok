import PropTypes from "prop-types";
import React from "react";
import AlertModal from "./AlertModal";

export default function AlertModalWithPageReload({ id, title, children, onClose }) {
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

AlertModalWithPageReload.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    onClose: PropTypes.func.isRequired,
};
