import avslagPaSoknad from "@images/avslag-pa-soknader.jpg";
import kiSoknadImg from "@images/ki-soknad-ung.jpg";
import studentsCollaborating from "@images/studentsCollaboratingAlt.jpg";
import writingImg from "@images/writing.jpg";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Heading, HGrid, HStack, Link } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import Image from "next/image";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import JobbKort from "@/features/ung/ui/JobbKort";

export default function UngMainPage() {
    return (
        <>
            <PageBlock width="2xl" gutters className="mt-responsive mb-responsive">
                <Heading size="xlarge" level="1" spacing>
                    Jobb for deg som er ung
                </Heading>
                <BodyLong size="large" spacing>
                    Leter du etter sommerjobb eller din første jobb? Her finner du stillinger og tips som gjør det
                    enklere å søke.
                </BodyLong>
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-responsive">
                <JobbKort />
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-12">
                <AkselNextLink
                    href="/ung/artikler/far-du-avslag-pa-jobbsoknader-dette-kan-du-gjore"
                    className="box-link block"
                >
                    <Box
                        className="bg-brand-peach-subtle"
                        padding={{ xs: "space-24", lg: "space-48" }}
                        borderRadius="4"
                    >
                        <HGrid
                            gap={{ xs: "space-24", lg: "space-48" }}
                            columns={{ xs: "1", md: "1fr 1fr", lg: "504px 1fr" }}
                            align="center"
                        >
                            <Image
                                className="box-link-image"
                                src={avslagPaSoknad}
                                width={504}
                                height={316}
                                alt=""
                                unoptimized
                                quality={75}
                                loading="eager"
                            />
                            <div>
                                <Heading spacing level="2" size="large">
                                    Får du avslag på jobbsøknader? Dette kan hjelpe deg videre
                                </Heading>
                                <BodyLong size="large" className="mb-1">
                                    Fem konkrete råd til deg som har fått avslag og hvordan du kommer deg videre i
                                    jobbsøkingen.
                                </BodyLong>
                                <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                            </div>
                        </HGrid>
                    </Box>
                </AkselNextLink>
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-responsive-tips">
                <div className="image-link-panel-grid-small">
                    <ImageLinkCard
                        className="image-link-card-radius-4"
                        href="/ung/artikler/husk-dette-nar-du-bruker-ki-i-soknaden-din"
                        image={kiSoknadImg}
                        alt="Ung person som jobber på laptop ute i parken"
                        title="Dette må du huske når du bruker KI i søknaden din"
                        description="Finn ut hvordan du kan bruke KI smart i jobbsøknaden og hva du må passe på underveis."
                        color="primary"
                    />
                    <ImageLinkCard
                        className="image-link-card-radius-4"
                        href="/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na"
                        image={writingImg}
                        alt="Ung person som jobber konsentrert på laptop ved skrivebordet"
                        title="Blitt ghosta av arbeidsgiver? Hva nå?"
                        description="Her er hva du kan gjøre når du ikke får svar."
                        color="secondary"
                        trackingData={{
                            name: "Klikk - Ung CTA",
                            data: {
                                ctaId: "artikkel-blitt-ghosta-av-arbeidsgiver",
                                ctaLabel: "Blitt ghosta av arbeidsgiver? Hva nå?",
                                location: "inline",
                                href: "/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na",
                            },
                        }}
                    />
                    <ImageLinkCard
                        className="image-link-card-radius-4"
                        href="/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb"
                        image={studentsCollaborating}
                        alt="Tre unge personer som sitter i en sofa og jobber sammen"
                        title="5 tips til deg som skal søke sommerjobb"
                        description="Enkle grep som hjelper deg å sikre sommerjobben."
                        color="tertiary"
                        trackingData={{
                            name: "Klikk - Ung CTA",
                            data: {
                                ctaId: "artikkel-5-tips-sommerjobb",
                                ctaLabel: "5 tips til deg som skal søke sommerjobb",
                                location: "inline",
                                href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                            },
                        }}
                    />
                </div>
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-responsive-survey">
                <Box paddingInline="space-16" className="text-center">
                    <HStack justify="center">
                        <Heading level="2" size="small" className="mb-4">
                            Vil du gi oss innspill til hva siden skal inneholde?
                        </Heading>
                    </HStack>

                    <HStack justify="center">
                        <Link
                            href="https://feedback.skyra.no/s1/BkuiaeZ6UrxKVd2lVybE4A"
                            data-umami-event="Klikk - ekstern lenke"
                            data-umami-event-destination="Skyra - unge-jobbsokere"
                            data-umami-event-url="https://feedback.skyra.no/s1/BkuiaeZ6UrxKVd2lVybE4A"
                        >
                            Skriv en kort tilbakemelding
                        </Link>
                    </HStack>
                </Box>
            </PageBlock>
        </>
    );
}
