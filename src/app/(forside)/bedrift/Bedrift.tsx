import { BodyLong, Button, Heading, HStack, LinkCard, Show } from "@navikt/ds-react";
import { FiguresGivingHighFive } from "@navikt/arbeidsplassen-react";
import laerlingImg from "@images/laerling-billakk.jpg";
import bedriftImg from "@images/bedrift.jpg";
import ghostetImg from "@images/ghostet.png";
import { PageBlock } from "@navikt/ds-react/Page";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import React from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";

export default function Bedrift() {
    return (
        <PageBlock width="2xl" gutters className="mt-5 mb-24">
            <HStack gap="space-16" align="center">
                <div className="flex-3">
                    <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                        Enkel jobbutlysning, kostnadsfritt
                    </Heading>
                    <BodyLong size="large" spacing>
                        Kom raskt i kontakt med kvalifiserte jobbsøkere.
                    </BodyLong>

                    <div className="mb-16">
                        <Button variant="primary" as="a" href="/stillingsregistrering" rel="nofollow">
                            Gå til min bedriftsside
                        </Button>
                    </div>
                </div>

                <Show above="lg">
                    <FiguresGivingHighFive />
                </Show>
            </HStack>

            <div className="arb-link-panel-grid mb-12">
                <LinkCard className="arb-link-panel-tertiary">
                    <LinkCardTitle>
                        <AkselNextLinkCardAnchor href="/stillingsregistrering/stillingsannonser" rel="nofollow">
                            Lag ny stillingsannonse
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                    <LinkCardDescription>Gjør deg synlig i et av Norges største stillingssøk.</LinkCardDescription>
                </LinkCard>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCardTitle>
                        <AkselNextLinkCardAnchor href="/rekruttere-flyktninger">
                            Ønsker du å rekruttere flyktninger?
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                    <LinkCardDescription>
                        Les våre anbefalinger for å nå ut til relevante kandidater.
                    </LinkCardDescription>
                </LinkCard>
            </div>

            <div className="image-link-panel-grid-small">
                <ImageLinkCard
                    href="/lys-ut-sommerjobber"
                    image={laerlingImg}
                    alt="Ung person får opplæring i billakkering"
                    title="Gi ungdom en sjanse – lys ut sommerjobber"
                    description="Mange unge trenger å få arbeidserfaring. Kan du være med på å gi dem en sjanse ved å lyse ut én eller flere sommerjobber i år?"
                    color="primary"
                />

                <ImageLinkCard
                    href="/superrask-soknad-bedrift"
                    image={bedriftImg}
                    alt="To personer som håndhilser"
                    title="Superrask Søknad"
                    description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                    color="secondary"
                />

                <ImageLinkCard
                    href="/husk-a-gi-tilbakemelding-til-jobbsoker"
                    image={ghostetImg}
                    alt="En mann mann som sitter ved et bord og ser tomt inn i mobilen sin"
                    title="Når dere ikke gir tilbakemelding – slik oppleves det for unge jobbsøkere"
                    description="Mange unge legger mye tid, motivasjon og håp i en jobbsøknad. Når de ikke får svar, oppleves det som
                    å bli ghostet."
                    color="tertiary"
                />
            </div>
        </PageBlock>
    );
}
