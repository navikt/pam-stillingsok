import { HStack, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import TrackedAkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/TrackedAkselNextLinkCardAnchor";
import { trackingEvent } from "@/app/_common/umami/trackingEvent";
import FigureEnteringDoorAlt from "@/features/ung/ui/FigureEnteringDoorAlt";
import FigureHolding18PlusSign from "@/features/ung/ui/FigureHolding18PlusSign";

function JobbKort() {
    return (
        <HStack gap="space-16" className="responsive-cards">
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
