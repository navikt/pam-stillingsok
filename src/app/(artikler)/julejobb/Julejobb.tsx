import bedriftImg from "@images/bedrift.jpg";
import floristsImg from "@images/florist-training.jpeg";
import supermarketImg from "@images/woman-portrait-supermarket.jpeg";
import { BodyLong, Heading, HGrid, LinkCard } from "@navikt/ds-react";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { PageBlock } from "@navikt/ds-react/Page";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};

export default function Julejobb({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    På arbeidsplassen.no finner du et{" "}
                    <AkselNextLink inlineText href="/stillinger?isXmasJob=true&v=6">
                        nytt julejobbfilter
                    </AkselNextLink>{" "}
                    som gjør det enklere å nå unge kandidater.
                </BodyLong>

                <ArticleBleedImage src={floristsImg} alt="Butikkmedarbeider" />

                <BodyLong className="mb-12">
                    Julen er en viktig rekrutteringsperiode for mange virksomheter. Samtidig er det mange unge som ser
                    etter sin første jobb eller en mulighet til å bygge relevant arbeidserfaring.
                </BodyLong>
                <Heading size="large" level="2" spacing>
                    Økt synlighet
                </Heading>
                <BodyLong spacing>
                    Med det nye julejobbfilteret på arbeidsplassen.no kan dere gjøre stillingene deres mer synlige for
                    kandidater som aktivt søker sesongarbeid i juleperioden.
                </BodyLong>
                <BodyLong spacing>
                    Ved å merke stillingen som julejobb, sesongjobb i perioden november/desember eller ved at dere
                    skriver jule-relaterte ord i annonsen (f.eks. julehjelp, julehandel eller høysesong før jul) øker
                    dere sjansen for å nå motiverte jobbsøkere når behovet for ekstra bemanning er størst.
                </BodyLong>
                <BodyLong className="mb-12">
                    Har dere jobber som kan passe for unge under 18 år? Få det frem i annonsen så blir den i tillegg
                    tilgjengelig for unge jobbsøkere i{" "}
                    <AkselNextLink inlineText href="/stillinger?under18=true&v=6">
                        et eget filter for de under 18 år.
                    </AkselNextLink>
                </BodyLong>
                <Heading size="large" level="2" spacing>
                    Vær tidlig ute
                </Heading>
                <BodyLong spacing>
                    Lys ut i god tid, beskriv arbeidsoppgaver og forventninger tydelig, og gi unge en mulighet til å få
                    verdifull erfaring i arbeidslivet.
                </BodyLong>
                <BodyLong className="mb-12">Finn deres neste julemedarbeider på arbeidsplassen.no.</BodyLong>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCardTitle>
                        <AkselNextLinkCardAnchor href="/stillingsregistrering/stillingsannonser">
                            Lys ut julejobben her
                        </AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </LinkCard>
            </ArticleWrapper>

            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Videre lesing
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkCard
                        href="/superrask-soknad-i-service-og-oppvekstyrker"
                        image={supermarketImg}
                        alt="En butikkmedarbeider mellom to hyller på matbutikken"
                        title="Superrask søknad mest populært i service- og oppvekstyrker"
                        description="Flere arbeidsgivere velger superrask søknad når de skal rekruttere. Mest brukt er løsningen i service- og oppvekstyrker."
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
                </HGrid>
            </PageBlock>
        </>
    );
}
