"use client";

import { Accordion, ExpansionCard } from "@navikt/ds-react";
import type { ReactNode } from "react";
import { type EventPayload, track } from "@/app/_common/umami";

type Tracking = EventPayload<"Klikk - Enklere vei til jobb">;

type TrackedExpansionCardProps = Readonly<{
    children: ReactNode;
    ariaLabel: string;
    tracking: Omit<Tracking, "action">;
    color?: "info";
    defaultOpen?: boolean;
}>;

export function TrackedExpansionCard({ children, ariaLabel, tracking, color, defaultOpen }: TrackedExpansionCardProps) {
    return (
        <ExpansionCard
            size="small"
            aria-label={ariaLabel}
            data-color={color}
            defaultOpen={defaultOpen}
            onToggle={(open) =>
                track("Klikk - Enklere vei til jobb", {
                    ...tracking,
                    action: open ? "åpne-trekkspill" : "lukke-trekkspill",
                })
            }
        >
            {children}
        </ExpansionCard>
    );
}

type TrackedAccordionItemProps = Readonly<{
    children: ReactNode;
    tracking: Omit<Tracking, "action">;
    defaultOpen?: boolean;
}>;

export function TrackedAccordionItem({ children, tracking, defaultOpen }: TrackedAccordionItemProps) {
    return (
        <Accordion.Item
            defaultOpen={defaultOpen}
            onOpenChange={(open) =>
                track("Klikk - Enklere vei til jobb", {
                    ...tracking,
                    action: open ? "åpne-trekkspill" : "lukke-trekkspill",
                })
            }
        >
            {children}
        </Accordion.Item>
    );
}
