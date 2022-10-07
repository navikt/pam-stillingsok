import PropTypes from "prop-types";
import React, { useState } from "react";
import "./CriteriaPanel.css";
import { Accordion } from "@navikt/ds-react";

function CriteriaPanel({ isOpenByDefault, title, children, panelId }) {
    const [isOpen, setIsOpen] = useState(() => {
        try {
            const found = sessionStorage.getItem(`${panelId}-open`);
            if (found && found === "true") {
                return true;
            } else if (found && found === "false") {
                return false;
            } else {
                return isOpenByDefault;
            }
        } catch (e) {
            return isOpenByDefault;
        }
    });

    function onPanelClick() {
        if (isOpen) {
            setIsOpen(false);
            try {
                sessionStorage.setItem(`${panelId}-open`, "false");
            } catch (e) {
                // ignore sessionStorage error
            }
        } else {
            setIsOpen(true);
            try {
                sessionStorage.setItem(`${panelId}-open`, "true");
            } catch (e) {
                // ignore sessionStorage error
            }
        }
    }

    return (
        <Accordion.Item open={isOpen}>
            <Accordion.Header onClick={onPanelClick}> {title}</Accordion.Header>
            <Accordion.Content className="CriteriaPanel">{children}</Accordion.Content>
        </Accordion.Item>
    );
}

CriteriaPanel.defaultProps = {
    isOpenByDefault: false
};

CriteriaPanel.propTypes = {
    isOpenByDefault: PropTypes.bool,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired
};

export default CriteriaPanel;
