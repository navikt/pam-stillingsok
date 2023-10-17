import PropTypes from "prop-types";
import React, { useState } from "react";
import { Accordion } from "@navikt/ds-react";
import logAmplitudeEvent from "../../../../common/tracking/amplitude";

function CriteriaPanel({ isOpenByDefault, title, children, panelId }) {
    const [isOpen, setIsOpen] = useState(() => {
        try {
            const found = sessionStorage.getItem(`${panelId}-open`);
            if (found && found === "true") {
                return true;
            }
            if (found && found === "false") {
                return false;
            }
            return isOpenByDefault;
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

        // Temporary amplitude event, code can be removed if it still
        // exists after november 2023
        try {
            logAmplitudeEvent("toggle filter accordion", {
                state: isOpen ? "close" : "open",
                filter: { title },
            });
        } catch (err) {
            // ignore
        }
    }

    return (
        <Accordion.Item open={isOpen}>
            <Accordion.Header onClick={onPanelClick}>{title}</Accordion.Header>
            <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
    );
}

CriteriaPanel.defaultProps = {
    isOpenByDefault: true,
};

CriteriaPanel.propTypes = {
    isOpenByDefault: PropTypes.bool,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    panelId: PropTypes.string.isRequired,
};

export default CriteriaPanel;
