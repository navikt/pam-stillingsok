import PropTypes from "prop-types";
import React, { useState } from "react";
import "./CriteriaPanel.less";
import ChevronCollapseIcon from "../../../../common/components/icons/ChevronCollapseIcon";
import ChevronExpandIcon from "../../../../common/components/icons/ChevronExpandIcon";

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
        <section className="CriteriaPanel">
            <h3 className="CriteriaPanel__h3">
                <button className="CriteriaPanel__button" type="button" aria-expanded={isOpen} onClick={onPanelClick}>
                    {isOpen ? <ChevronCollapseIcon ariaHidden={true} /> : <ChevronExpandIcon ariaHidden={true} />}
                    <span>{title}</span>
                </button>
            </h3>
            {isOpen && children}
        </section>
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
