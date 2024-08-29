import { Bleed, BodyLong, Box, Button, Heading, HStack, Show } from "@navikt/ds-react";
import { FiguresSideBySide } from "@navikt/arbeidsplassen-react";
import ImageLinkPanelSmall from "@/app/(artikler)/_components/ImageLinkPanelSmall";
import InformationUkraine from "@/app/(forside)/_components/InformationUkraine";

export default function Home() {
    return (
        <div className="container-large mt-5 mb-24">
            <HStack gap="4" align="center">
                <div className="flex-3">
                    <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                        Alt av arbeid, <br />
                        samlet på én plass.
                    </Heading>
                    <BodyLong size="large" spacing>
                        Finn din neste jobb i en av Norges største samlinger av stillinger. Her finner du jobber fra
                        alle bransjer i markedet.
                    </BodyLong>

                    <div className="mb-16">
                        <Button variant="primary" as="a" href="/stillinger" role="link">
                            Søk etter din neste jobb
                        </Button>
                    </div>
                </div>

                <Show above="lg">
                    <FiguresSideBySide />
                </Show>
            </HStack>

            <div className="image-link-panel-grid-small mb-12">
                <ImageLinkPanelSmall
                    href="/superrask-soknad-person"
                    image="/images/jobbsoker.jpg"
                    alt="En person som skriver på mobilen sin."
                    title="Superrask søknad"
                    description="En enklere måte å komme i kontakt med bedrifter."
                    color="primary"
                />
                <ImageLinkPanelSmall
                    href="jobbe-i-utlandet"
                    image="/images/paris.jpg"
                    alt="Bilde av Eiffeltårnet"
                    title="Jobbe i utlandet?"
                    description="Den Europeiske Jobbmobilitetsportalen (EURES) er et tilbud til deg som ønsker å finne en jobb i EU-/EØS-området og Sveits."
                    color="secondary"
                />
                <ImageLinkPanelSmall
                    image="/images/jobbtreff.jpg"
                    alt="Bilde av person med laptop"
                    title="Enklere å finne jobber som kan passe"
                    description="Vi bruker kunstig intelligens til å plassere annonsen i den kategorien som den (mest sannsynlig) hører hjemme i."
                    href="/nye-filtre"
                    color="tertiary"
                />
            </div>

            <div className="24">
                <Bleed marginInline="full" className="overflow-x-hidden">
                    <Box background="surface-alt-3-moderate" padding={{ xs: "6", md: "4" }}>
                        <InformationUkraine />
                    </Box>
                </Bleed>
            </div>
        </div>
    );
}
