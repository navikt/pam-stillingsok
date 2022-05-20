import PropTypes from "prop-types";
import React from "react";
import AlertModal from "./AlertModal";
import "./ErrorWithReloadPageModal.less";

export default function ErrorWithReloadPageModal({ id, title, children, onClose }) {
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

ErrorWithReloadPageModal.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    onClose: PropTypes.func.isRequired
};
