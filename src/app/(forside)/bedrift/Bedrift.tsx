import bedriftImg from "@images/bedrift.jpg";
import ghostetImg from "@images/ghostet.jpg";
import annonseImg from "@images/stillingsannonse.jpg";
import { FiguresGivingHighFive } from "@navikt/arbeidsplassen-react";
import { BodyLong, Button, Heading, HStack, LinkCard, Show } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { PageBlock } from "@navikt/ds-react/Page";
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
                    href="/superrask-soknad-bedrift"
                    image={bedriftImg}
                    alt="To personer som håndhilser"
                    title="Superrask Søknad"
                    description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                    color="primary"
                />

                <ImageLinkCard
                    href="/husk-a-gi-tilbakemelding-til-jobbsoker"
                    image={ghostetImg}
                    alt="En mann som sitter ved et bord og ser tomt inn i mobilen sin"
                    title="Når dere ikke gir tilbakemelding – slik oppleves det for unge jobbsøkere"
                    description="Mange unge legger mye tid, motivasjon og håp i en jobbsøknad. Når de ikke får svar, oppleves det som å bli ghostet."
                    color="secondary"
                />

                <ImageLinkCard
                    href="/skikkelig-bra-stillingsannonse"
                    image={annonseImg}
                    alt="Person som skriver på en skrivemaskin"
                    title="Skikkelig bra stillingsannonse"
                    description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                    color="tertiary"
                />
            </div>
        </PageBlock>
    );
}
