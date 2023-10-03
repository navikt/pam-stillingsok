import PropTypes from "prop-types";
import React, { useState } from "react";
import "./CriteriaPanel.css";
import { ChevronDownIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import logAmplitudeEvent from "@/src/common/tracking/amplitude";

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
        <div className="Filter__section">
            <button
                type="button"
                className="SearchForm__expand-filter-button"
                onClick={onPanelClick}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <ChevronDownIcon aria-hidden="true" width="1.5em" height="1.5em" />
                ) : (
                    <ChevronRightIcon aria-hidden="true" width="1.5em" height="1.5em" />
                )}
                {title}
            </button>
            {isOpen && children}
        </div>
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
