import PropTypes from "prop-types";
import React, { useState } from "react";
import { Accordion } from "@navikt/ds-react";

function FilterAccordionItem({ title, children, panelId, isOpenByDefault = true }) {
    // Todo: Bug, noen ganger må trykke to ganger på et panel for å åpne etter page refresh
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
    }

    return (
        <Accordion.Item open={isOpen}>
            <Accordion.Header onClick={onPanelClick}>{title}</Accordion.Header>
            <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
    );
}

FilterAccordionItem.propTypes = {
    isOpenByDefault: PropTypes.bool,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
    panelId: PropTypes.string.isRequired,
};

export default FilterAccordionItem;
