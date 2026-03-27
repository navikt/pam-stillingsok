"use client";

import { HStack, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardAnchor, LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/esm/link-card";
import FigureHoldingFlowerAlt from "@/features/ung/ui/FigureHoldingFlowerAlt";
import FigureHolding18PlusSign from "@/features/ung/ui/FigureHolding18PlusSign";
import FigureEnteringDoorAlt from "@/features/ung/ui/FigureEnteringDoorAlt";
import React from "react";

function JobbKort() {
    return (
        <HStack gap="space-16" className="responsive-cards">
            <LinkCard data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureHoldingFlowerAlt />
                        <LinkCardAnchor href="/sommerjobb">Sommerjobben {new Date().getFullYear()}</LinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>
                    Lurer du på hva du skal gjøre i sommer? Se over 15000 jobber over hele Norge
                </LinkCardDescription>
            </LinkCard>
            <LinkCard data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureHolding18PlusSign />
                        <LinkCardAnchor href="/stillinger?under18=true&v=5">Jobber for deg under 18 år</LinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>Se jobber du kan søke på selv om du er under 18</LinkCardDescription>
            </LinkCard>
            <LinkCard data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureEnteringDoorAlt />
                        <LinkCardAnchor href="/stillinger?experience=Ingen&v=5">
                            Jobber uten krav til erfaring
                        </LinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>
                    Ingen erfaring? Ingen problem, se stillinger uten krav til erfaring
                </LinkCardDescription>
            </LinkCard>
        </HStack>
    );
}
export default JobbKort;
