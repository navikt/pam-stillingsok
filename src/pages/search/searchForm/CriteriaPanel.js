import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import PropTypes from "prop-types";
import React, { useState } from "react";
import "./CriteriaPanel.less";

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
        <Ekspanderbartpanel
            tittel={title}
            className="Facet ekspanderbartPanel--green"
            onClick={onPanelClick}
            tag="h3"
            apen={isOpen}
        >
            <div role="group" aria-label={title} className="Facet__inner">
                {children}
            </div>
        </Ekspanderbartpanel>
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
