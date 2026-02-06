"use client";

import React, { ReactElement, ReactNode, useMemo, useState } from "react";
import { Accordion } from "@navikt/ds-react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";

export const PANEL_KEYS = [
    "published",
    "county",
    "postcode",
    "occupationLevel1",
    "extent",
    "engagementType",
    "workLanguage",
    "education",
    "needDriversLicense",
    "experience",
    "remote",
] as const;

export type PanelKey = (typeof PANEL_KEYS)[number];

export type FilterAccordionProps = {
    title: string;
    children: ReactNode;
    /** Nøkler som avgjør om den skal være åpen eller ikke */
    watchKeys: readonly PanelKey[];
    /** Åpne når minst én nøkkel er aktiv eller når alle er aktive. */
    openWhen?: "any" | "all";
    defaultOpen?: boolean;
};

function FilterAccordionItem(props: FilterAccordionProps): ReactElement {
    const { title, children, watchKeys, openWhen = "any", defaultOpen } = props;

    const { has: hasSelected } = useQuery();

    const normalizedKeys = useMemo<readonly string[]>(() => watchKeys.filter((k) => k.trim().length > 0), [watchKeys]);

    const computedShouldOpen = useMemo<boolean>(() => {
        if (normalizedKeys.length === 0) return false;
        if (openWhen === "all") return normalizedKeys.every((key) => hasSelected(key));
        return normalizedKeys.some((key) => hasSelected(key));
    }, [hasSelected, openWhen, normalizedKeys]);

    const initialOpen =
        typeof defaultOpen === "boolean"
            ? defaultOpen
            : normalizedKeys.includes("published")
              ? true
              : computedShouldOpen;

    const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

    const handleToggle = () => setIsOpen((prev) => !prev);

    return (
        <Accordion.Item open={isOpen}>
            <Accordion.Header onClick={handleToggle}>{title}</Accordion.Header>
            <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
    );
}

export default FilterAccordionItem;
