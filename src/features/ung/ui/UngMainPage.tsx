import kiSoknadImg from "@images/ki-soknad-ung.jpg";
import studentsCollaborating from "@images/studentsCollaborating.png";
import writingImg from "@images/writing.jpg";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { BodyLong, Box, Heading, HGrid, HStack, Link } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import Image from "next/image";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { trackingEvent } from "@/app/_common/umami/trackingEvent";
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

            <PageBlock width="2xl" gutters className="mb-responsive-tips">
                <AkselNextLink
                    href="/ung/artikler/husk-dette-nar-du-bruker-ki-i-soknaden-din"
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
                                src={kiSoknadImg}
                                width={504}
                                height={316}
                                alt=""
                                unoptimized
                                quality={75}
                                loading="eager"
                            />
                            <div>
                                <Heading spacing level="2" size="large">
                                    Dette må du huske når du bruker KI i søknaden din
                                </Heading>
                                <BodyLong size="large" className="mb-1">
                                    Mange bruker kunstig intelligens (KI) når de skal søke jobb, for eksempel Copilot og
                                    ChatGPT. Det kan være nyttig, men vi må som alltid bruke KI på en bevisst og kritisk
                                    måte.
                                </BodyLong>
                                <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                            </div>
                        </HGrid>
                    </Box>
                </AkselNextLink>
            </PageBlock>

            <PageBlock width="2xl" gutters className="mb-responsive-tips">
                <AkselNextLink
                    href="/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na"
                    className="box-link block"
                    tracking={trackingEvent("Klikk - Ung CTA", {
                        ctaId: "artikkel-blitt-ghosta-av-arbeidsgiver",
                        ctaLabel: "Blitt ghosta av arbeidsgiver? Hva nå?",
                        location: "inline",
                        href: "/ung/artikler/blitt-ghosta-av-arbeidsgiver-hva-na",
                    })}
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
                                src={writingImg}
                                width={504}
                                height={316}
                                alt=""
                                unoptimized
                                quality={75}
                                loading="eager"
                            />
                            <div>
                                <Heading spacing level="2" size="large">
                                    Blitt ghosta av arbeidsgiver? Hva nå?
                                </Heading>
                                <BodyLong size="large" className="mb-1">
                                    Mange unge opplever å ikke få svar etter å ha søkt jobb. Her er hva du kan gjøre når
                                    du ikke får svar.
                                </BodyLong>
                                <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                            </div>
                        </HGrid>
                    </Box>
                </AkselNextLink>
            </PageBlock>
            <PageBlock width="2xl" gutters className="mb-responsive-tips">
                <AkselNextLink
                    href="/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb"
                    className="box-link block"
                    tracking={trackingEvent("Klikk - Ung CTA", {
                        ctaId: "artikkel-5-tips-sommerjobb",
                        ctaLabel: "5 tips til deg som skal søke sommerjobb",
                        location: "inline",
                        href: "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
                    })}
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
                                src={studentsCollaborating}
                                width={504}
                                height={316}
                                alt=""
                                unoptimized
                                quality={75}
                                loading="eager"
                            />
                            <div>
                                <Heading spacing level="2" size="large">
                                    5 tips til deg som skal søke sommerjobb
                                </Heading>
                                <BodyLong size="large" className="mb-1">
                                    Enkle grep som hjelper deg å sikre sommerjobben.
                                </BodyLong>
                                <ArrowRightIcon aria-hidden="true" fontSize="2rem" />
                            </div>
                        </HGrid>
                    </Box>
                </AkselNextLink>
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
