"use client";

import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { Accordion } from "@navikt/ds-react";
import { UserPreferencesContext } from "@/app/_common/user/UserPreferenceProvider";

function FilterAccordionItem({ title, children, panelId }) {
    const {
        publishedJobFilterOpen,
        addPublishedJobFilterOpen,
        removePublishedJobFilterOpen,
        openFilters,
        addOpenFilter,
        removeOpenFilter,
    } = useContext(UserPreferencesContext);
    const [isOpen, setIsOpen] = useState(openFilters.includes(panelId));
    const [isPublishedJobFilterOpen, setIsPublishedJobFilterOpen] = useState(publishedJobFilterOpen);

    function onPanelClick() {
        if (!isOpen) {
            addOpenFilter(panelId);
        } else {
            removeOpenFilter(panelId);
        }
        setIsOpen(!isOpen);
    }

    function onPanelPublishClick() {
        if (!isPublishedJobFilterOpen) {
            addPublishedJobFilterOpen();
        } else {
            removePublishedJobFilterOpen();
        }
        setIsPublishedJobFilterOpen(!isPublishedJobFilterOpen);
    }

    if (panelId === "publisert") {
        return (
            <section aria-label={`${title}, søkefilter`}>
                <Accordion.Item open={isPublishedJobFilterOpen}>
                    <Accordion.Header onClick={onPanelPublishClick}>{title}</Accordion.Header>
                    <Accordion.Content>{children}</Accordion.Content>
                </Accordion.Item>
            </section>
        );
    }

    return (
        <section aria-label={`${title}, søkefilter`}>
            <Accordion.Item open={isOpen}>
                <Accordion.Header onClick={onPanelClick}>{title}</Accordion.Header>
                <Accordion.Content>{children}</Accordion.Content>
            </Accordion.Item>
        </section>
    );
}

FilterAccordionItem.propTypes = {
    panelId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default FilterAccordionItem;
