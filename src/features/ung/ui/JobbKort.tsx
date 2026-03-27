import { HStack, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import FigureHoldingFlowerAlt from "@/features/ung/ui/FigureHoldingFlowerAlt";
import FigureHolding18PlusSign from "@/features/ung/ui/FigureHolding18PlusSign";
import FigureEnteringDoorAlt from "@/features/ung/ui/FigureEnteringDoorAlt";
import React from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

function JobbKort() {
    return (
        <HStack gap="space-16" className="responsive-cards">
            <LinkCard className="linkcard-hover-underline" data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureHoldingFlowerAlt />
                        <AkselNextLinkCardAnchor href="/sommerjobb">
                            Sommerjobben {new Date().getFullYear()}
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>
                    Lurer du på hva du skal gjøre i sommer? Se over 15000 jobber over hele Norge
                </LinkCardDescription>
            </LinkCard>
            <LinkCard className="linkcard-hover-underline" data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureHolding18PlusSign />
                        <AkselNextLinkCardAnchor href="/stillinger?under18=true&v=5">
                            Jobber for deg under 18 år
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>Se jobber du kan søke på selv om du er under 18</LinkCardDescription>
            </LinkCard>
            <LinkCard className="linkcard-hover-underline" data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureEnteringDoorAlt />
                        <AkselNextLinkCardAnchor href="/stillinger?experience=Ingen&v=5">
                            Jobber uten krav til erfaring
                        </AkselNextLinkCardAnchor>
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
