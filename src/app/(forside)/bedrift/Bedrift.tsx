import { BodyLong, Button, Heading, HStack, Show } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import { FiguresGivingHighFive } from "@navikt/arbeidsplassen-react";
import ImageLinkPanelSmall from "@/app/_common/components/ImageLinkPanelSmall";
import Link from "next/link";
import laerlingImg from "@images/laerling-billakk.jpg";
import bedriftImg from "@images/bedrift.jpg";
import annonseImg from "@images/stillingsannonse.jpg";

export default function Bedrift() {
    return (
        <div className="container-large mt-5 mb-24">
            <HStack gap="4" align="center">
                <div className="flex-3">
                    <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                        Enkel jobbutlysning, kostnadsfritt
                    </Heading>
                    <BodyLong size="large" spacing>
                        Kom raskt i kontakt med kvalifiserte jobbsøkere.
                    </BodyLong>

                    <div className="mb-16">
                        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                        <Button variant="primary" as="a" href="/stillingsregistrering" role="link" rel="nofollow">
                            Gå til min bedriftsside
                        </Button>
                    </div>
                </div>

                <Show above="lg">
                    <FiguresGivingHighFive />
                </Show>
            </HStack>

            <div className="arb-link-panel-grid mb-12">
                <LinkPanel
                    className="arb-link-panel-tertiary"
                    href="/stillingsregistrering/stillingsannonser"
                    rel="nofollow"
                >
                    <LinkPanelTitle className="navds-heading--small">Lag ny stillingsannonse</LinkPanelTitle>
                    <LinkPanelDescription className="navds-link-panel__description navds-body-long">
                        Gjør deg synlig i et av Norges største stillingssøk.
                    </LinkPanelDescription>
                </LinkPanel>

                <LinkPanel className="arb-link-panel-primary" as={Link} href="/rekruttere-flyktninger">
                    <LinkPanelTitle className="navds-heading--small">
                        Ønsker du å rekruttere flyktninger?
                    </LinkPanelTitle>
                    <LinkPanelDescription className="navds-link-panel__description navds-body-long">
                        Les våre anbefalinger for å nå ut til relevante kandidater.
                    </LinkPanelDescription>
                </LinkPanel>
            </div>

            <div className="image-link-panel-grid-small">
                <ImageLinkPanelSmall
                    href="/lys-ut-sommerjobber"
                    image={laerlingImg}
                    alt="Ung person får opplæring i billakkering"
                    title="Gi ungdom en sjanse – lys ut sommerjobber"
                    description="Mange unge trenger å få arbeidserfaring. Kan du være med på å gi dem en sjanse ved å lyse ut én eller flere sommerjobber i år?"
                    color="primary"
                />

                <ImageLinkPanelSmall
                    href="/superrask-soknad-bedrift"
                    image={bedriftImg}
                    alt="To personer som håndhilser"
                    title="Superrask Søknad"
                    description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                    color="secondary"
                />

                <ImageLinkPanelSmall
                    href="/skikkelig-bra-stillingsannonse"
                    image={annonseImg}
                    alt="Person som skriver på en skrivemaskin"
                    title="Skriv en skikkelig bra stillingsannonse!"
                    description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når du skriver
                    annonsen?"
                    color="tertiary"
                />
            </div>
        </div>
    );
}
