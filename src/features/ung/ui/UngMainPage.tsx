import React from "react";
import { BodyLong, BodyShort, Box, Heading, HGrid, HStack } from "@navikt/ds-react";
import JobbKort from "@/features/ung/ui/JobbKort";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";
import { PageBlock } from "@navikt/ds-react/Page";
import Image from "next/image";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import studentsCollaborating from "@images/studentsCollaborating.png";
import writingImg from "@images/writing.jpg";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { trackingEvent } from "@/app/_common/umami/trackingEvent";

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
                        <BodyShort size="small">
                            <SkyraSurvey
                                buttonText="Skriv en kort tilbakemelding"
                                skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-arbeidsplassen-ung"
                                asLink={true}
                            />
                        </BodyShort>
                    </HStack>
                </Box>
            </PageBlock>
        </>
    );
}
