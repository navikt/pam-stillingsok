import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Accordion } from "@navikt/ds-react";
import { UserPreferencesContext } from "@/app/_common/user/UserPreferenceProvider";

function FilterAccordionItem({ title, children, panelId }) {
    const { closedFilterAccordions, saveCookieValue } = useContext(UserPreferencesContext);

    function onPanelClick() {
        saveCookieValue("closedFilterAccordions", panelId);
    }

    return (
        <Accordion.Item defaultOpen={!closedFilterAccordions.includes(panelId)}>
            <Accordion.Header onClick={onPanelClick}>{title}</Accordion.Header>
            <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
    );
}

FilterAccordionItem.propTypes = {
    panelId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default FilterAccordionItem;
