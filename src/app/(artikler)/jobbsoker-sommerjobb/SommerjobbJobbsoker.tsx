import { BodyLong, Heading, HGrid, Link } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import studentsImg from "@images/students.jpg";
import jobbsokerImg from "@images/jobbsoker.jpg";
import gardeningImg from "@images/woman-portrait-gardening.jpg";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";

type Props = {
    readonly meta: PageInfo;
};
export default function SommerjobbJobbsoker({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Nye moglegheiter blir lagde ut heile tida – søk på den neste sommarjobben din no.
                </BodyLong>

                <ArticleBleedImage
                    src={gardeningImg}
                    alt="Hagearbeidar som held to plantepotter og smiler mot kameraet."
                />

                <BodyLong spacing>
                    For mange er sommarjobb det første møtet med arbeidslivet. Erfaringa du får her kan bli veldig
                    verdifull å ta med seg og ser bra ut på CV- ein din.
                </BodyLong>
                <BodyLong spacing>
                    Arbeidsgivarar registrerer dagleg ledige stillingar på arbeidsplassen.no. I tillegg hentar vi
                    automatisk inn stillingar frå mange nettstader, og vi gir deg ei samla oversikt. Enkelt og greitt!
                </BodyLong>
                <BodyLong className="mb-12">
                    <AkselNextLink href="/stillinger?q=sommerjobb">Her finn du sommarjobbar</AkselNextLink>
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Tips til deg som vil søkje på sommarjobbar
                </Heading>
                <Heading size="medium" level="3" spacing>
                    Hvordan skilje seg ut?
                </Heading>
                <BodyLong spacing>
                    Ver positiv og få fram kvifor du er den rette for jobben. Kanskje du har vore hjelpetrenar på
                    fotballaget, sete i elevrådet eller hatt småjobbar? Har du hobbyar? Kanskje det har gitt deg
                    kunnskap og ferdigheiter som arbeidsgivar ser etter?
                </BodyLong>
                <BodyLong spacing>
                    Skriv gjerne om nokre fag på skulen du synest er interessante eller nokon kurs som du synest er
                    morosame som kanskje kan ha relevans for jobben.
                </BodyLong>

                <Heading size="medium" level="3" spacing>
                    Superrask søknad
                </Heading>
                <BodyLong spacing>
                    På arbeidsplassen.no finn du enkelte sommarjobbar som har superrask søknad. Du sender ingen CV, men
                    skriv kvifor du meiner du er rett person for jobben. Hugs at du konkurrerer med andre om jobbane, så
                    det er viktig at du verkar positiv og motivert for jobben.
                </BodyLong>

                <Heading size="medium" level="3" spacing>
                    Bruk nettverket ditt
                </Heading>
                <BodyLong spacing>
                    Mange finnar jobb gjennom nettverket sitt. Fortel at du er på jakt etter jobb. Jo fleire du snakkar
                    med, jo større sjanse er det for at det dukkar opp jobbmoglegheiter.
                </BodyLong>

                <BodyLong className="mb-12">
                    Sjekk fleire jobbsøkjartips på{" "}
                    <Link href="https://www.nav.no/soker-jobb#jobbsokertips">nav.no</Link>
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillinger?q=sommerjobb">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Sjå alle sommarjobbar
                    </LinkPanelTitle>
                </LinkPanel>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg" aria-labelledby="related-articles-heading">
                <Heading size="large" level="2" id="related-articles-heading" spacing>
                    Vidare lesing
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelMedium
                        href="/superrask-soknad-person"
                        image={jobbsokerImg}
                        alt="En person som skriver på mobilen sin."
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med bedrifter."
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
