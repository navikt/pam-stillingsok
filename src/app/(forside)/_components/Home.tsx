"use client";

import jobbsokerImg from "@images/jobbsoker.jpg";
import parisImg from "@images/paris.jpg";
import studentsImg from "@images/students.jpg";

import { Box, Heading, HGrid, LinkCard } from "@navikt/ds-react";
import { LinkCardAnchor, LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { PageBlock } from "@navikt/ds-react/Page";

import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";
import { track } from "@/app/_common/umami";
import SommerjobbPanel from "@/app/(forside)/_components/SommerjobbPanel";
import { HeroHeading } from "@/features/sokehjelper/ui/Sokehjelper/HeroHeading";
import Sokehjelper from "@/features/sokehjelper/ui/Sokehjelper/Sokehjelper";
import SokehjelperV2 from "@/features/sokehjelper/ui/SokehjelperV2/SokehjelperV2";
import UngOgVilJobbePromo from "@/features/ung/ui/UngOgVilJobbePromo/UngOgVilJobbePromo";

export default function Home() {
    /** TODO: måtte endre til div her pga hydration error etter konvertering til next 16, må finne mer ut av dette*/
    return (
        <div>
            <PageBlock width="2xl" gutters className="mt-5 mb-12">
                <Box maxWidth="640px" marginInline="auto">
                    <HeroHeading />
                </Box>

                <SokehjelperV2 />
            </PageBlock>

            <PageBlock width="2xl" gutters className="mt-5 mb-12">
                <Sokehjelper />
            </PageBlock>
            {/*<PageBlock width="2xl" gutters className="mt-5 mb-12">
                <HStack gap="space-80" align="center">
                    <div className="flex-3">
                        <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                            Alle ledige jobber, <br />
                            samlet på én plass
                        </Heading>

                        <BodyLong size="large" spacing>
                            Å lete etter jobb skal være enkelt. Fra deltid til direktør, finn jobben som passer for deg.
                        </BodyLong>

                        <HStack gap="space-16" className="mb-16">
                            <Button
                                variant="primary"
                                as={Link}
                                href="/stillinger"
                                prefetch={false}
                                icon={<MagnifyingGlassIcon aria-hidden="true" />}
                                onClick={() => {
                                    track("Klikk - Forside CTA", {
                                        location: "hero",
                                        href: "/stillinger",
                                        ctaLabel: `Søk etter jobber`,
                                        ctaId: "sok-etter-jobber",
                                    });
                                }}
                            >
                                Søk etter jobber
                            </Button>
                            <Button
                                variant="secondary"
                                as={Link}
                                prefetch={false}
                                href="/sommerjobb"
                                icon={<ParasolBeachIcon aria-hidden="true" />}
                                onClick={() => {
                                    track("Klikk - Forside CTA", {
                                        location: "hero",
                                        href: "/sommerjobb",
                                        ctaLabel: `Sommerjobben ${new Date().getFullYear()}`,
                                        ctaId: "sommerjobb",
                                    });
                                }}
                            >
                                Sommerjobben {new Date().getFullYear()}
                            </Button>
                        </HStack>
                    </div>

                    <Show above="lg">
                        <FiguresSideBySide />
                    </Show>
                </HStack>
            </PageBlock>*/}
            <PageBlock width="2xl" gutters className="mb-12" data-nosnippet>
                <UngOgVilJobbePromo />
            </PageBlock>
            <PageBlock width="2xl" gutters className="mb-12" data-nosnippet>
                <SommerjobbPanel />
            </PageBlock>
            <PageBlock width="2xl" gutters className="mb-12">
                <div className="image-link-panel-grid-small mb-12">
                    <ImageLinkCard
                        href="/superrask-soknad-person"
                        image={jobbsokerImg}
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        color="primary"
                    />

                    <ImageLinkCard
                        href="/tips-til-jobbsoknaden"
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen."
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte deg."
                        color="secondary"
                    />

                    <ImageLinkCard
                        href="/jobbe-i-utlandet"
                        image={parisImg}
                        alt="Bilde av Eiffeltårnet"
                        title="Jobbe i utlandet?"
                        description="Den Europeiske Jobbmobilitetsportalen (EURES) er et tilbud til deg som ønsker å finne en jobb i EU-/EØS-området og Sveits."
                        color="tertiary"
                    />
                </div>

                <Heading size="medium" spacing level="2">
                    Prøv også
                </Heading>
                <HGrid gap="space-20 space-32" columns={{ xs: 1, md: "1fr 1fr" }}>
                    <LinkCard className="bg-brand-peach-subtle">
                        <LinkCardTitle>
                            <LinkCardAnchor
                                href="https://karriereveiledning.no/"
                                rel="external"
                                onClick={() => {
                                    track("Klikk - Forside KarriereveiledningNo");
                                }}
                            >
                                Karriereveiledning.no
                            </LinkCardAnchor>
                        </LinkCardTitle>
                        <LinkCardDescription>
                            Her finner du verktøy for å søke jobb, og du kan få gratis veiledning på chat, telefon og
                            e-post.
                        </LinkCardDescription>
                    </LinkCard>
                    <LinkCard className="bg-brand-peach-subtle">
                        <LinkCardTitle>
                            <LinkCardAnchor
                                href="https://utdanning.no/"
                                rel="external"
                                onClick={() => {
                                    track("Klikk - Forside UtdanningNo");
                                }}
                            >
                                Utdanning.no
                            </LinkCardAnchor>
                        </LinkCardTitle>
                        <LinkCardDescription>Få informasjon om utdanning, karriere og yrker.</LinkCardDescription>
                    </LinkCard>
                </HGrid>

                <div className="text-center mt-8">
                    <BodyLong className="mb-2">Hvor fornøyd er du med arbeidsplassen.no?</BodyLong>
                    <SkyraSurvey
                        buttonText="Svar på undersøkelsen"
                        skyraSlug="arbeids-og-velferdsetaten-nav/wip-jobbsoking"
                    />
                </div>
            </PageBlock>
        </div>
    );
}
