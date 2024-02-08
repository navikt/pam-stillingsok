import PropTypes from "prop-types";
import React from "react";
import { Accordion } from "@navikt/ds-react";

function FilterAccordionItem({ title, children }) {
    return (
        <Accordion.Item defaultOpen>
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
    );
}

FilterAccordionItem.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default FilterAccordionItem;
