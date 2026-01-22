"use client";

import { BodyLong, Button, Heading, HStack, Show } from "@navikt/ds-react";
import { FiguresSideBySide } from "@navikt/arbeidsplassen-react";
import { MagnifyingGlassIcon, ParasolBeachIcon } from "@navikt/aksel-icons";
import InformationUkraine from "@/app/(forside)/_components/InformationUkraine";
import Link from "next/link";
import KarriereveiledningPanel from "./Karriereveiledning";
import jobbsokerImg from "@images/jobbsoker.jpg";
import studentsImg from "@images/students.jpg";
import parisImg from "@images/paris.jpg";
import { PageBlock } from "@navikt/ds-react/Page";
import UngOgVilJobbePromo from "@/features/ung/ui/UngOgVilJobbePromo/UngOgVilJobbePromo";
import SommerjobbPanel from "@/app/(forside)/_components/SommerjobbPanel";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";

export default function Home() {
    return (
        <>
            <PageBlock width="2xl" gutters className="mt-5 mb-12">
                <HStack gap="space-80" align="center">
                    <div className="flex-3">
                        <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                            Alle ledige jobber, <br />
                            samlet på én plass
                        </Heading>

                        <BodyLong size="large" spacing>
                            Lete etter jobb skal være enkelt. Fra deltid til direktør, finn jobben som passer for deg.
                        </BodyLong>

                        <HStack gap="space-16" className="mb-16">
                            <Button
                                variant="primary"
                                as={Link}
                                href="/stillinger"
                                icon={<MagnifyingGlassIcon aria-hidden="true" />}
                            >
                                Søk etter jobber
                            </Button>
                            <Button
                                variant="secondary"
                                as={Link}
                                href="/sommerjobb"
                                icon={<ParasolBeachIcon aria-hidden="true" />}
                            >
                                Sommerjobben {new Date().getFullYear()}
                            </Button>
                        </HStack>
                    </div>

                    <Show above="lg">
                        <FiguresSideBySide />
                    </Show>
                </HStack>
            </PageBlock>
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
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-12" data-nosnippet="true">
                <KarriereveiledningPanel />
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-12">
                <InformationUkraine />
            </PageBlock>
        </>
    );
}
