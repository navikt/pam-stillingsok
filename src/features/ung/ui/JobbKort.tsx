import { HStack, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import FigureHoldingFlowerAlt from "@/features/ung/ui/FigureHoldingFlowerAlt";
import FigureHolding18PlusSign from "@/features/ung/ui/FigureHolding18PlusSign";
import FigureEnteringDoorAlt from "@/features/ung/ui/FigureEnteringDoorAlt";
import React from "react";

import TrackedAkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/TrackedAkselNextLinkCardAnchor";
import { trackingEvent } from "@/app/_common/umami/trackingEvent";

function JobbKort() {
    return (
        <HStack gap="space-16" className="responsive-cards">
            <LinkCard className="linkcard-hover-underline" data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureHoldingFlowerAlt />
                        <TrackedAkselNextLinkCardAnchor
                            tracking={trackingEvent("Klikk - Ung CTA", {
                                ctaId: "sommerjobb",
                                ctaLabel: `Sommerjobben ${new Date().getFullYear()}`,
                                location: "hero",
                                href: "/sommerjobb",
                            })}
                            href="/sommerjobb"
                        >
                            Sommerjobben {new Date().getFullYear()}
                        </TrackedAkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>
                    Lurer du på hva du skal gjøre i sommer? Se over 15000 jobber over hele Norge.
                </LinkCardDescription>
            </LinkCard>
            <LinkCard className="linkcard-hover-underline" data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureHolding18PlusSign />
                        <TrackedAkselNextLinkCardAnchor
                            href="/stillinger?under18=true&v=5"
                            tracking={trackingEvent("Klikk - Ung CTA", {
                                ctaId: "under-18",
                                ctaLabel: "Jobber for deg under 18 år",
                                location: "hero",
                                href: "/stillinger?under18=true&v=5",
                            })}
                        >
                            Jobber for deg under 18 år
                        </TrackedAkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>Se jobber du kan søke på selv om du er under 18.</LinkCardDescription>
            </LinkCard>
            <LinkCard className="linkcard-hover-underline" data-ung-link-card="blue" style={{ flex: 1 }}>
                <VStack asChild gap="space-8">
                    <LinkCardTitle>
                        <FigureEnteringDoorAlt />
                        <TrackedAkselNextLinkCardAnchor
                            href="/stillinger?experience=Ingen&v=5"
                            tracking={trackingEvent("Klikk - Ung CTA", {
                                ctaId: "uten-krav-til-erfaring",
                                ctaLabel: "Jobber uten krav til erfaring",
                                location: "hero",
                                href: "/stillinger?experience=Ingen&v=5",
                            })}
                        >
                            Jobber uten krav til erfaring
                        </TrackedAkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </VStack>
                <LinkCardDescription>
                    Ingen erfaring? Ingen problem, se stillinger uten krav til erfaring.
                </LinkCardDescription>
            </LinkCard>
        </HStack>
    );
}
export default JobbKort;
