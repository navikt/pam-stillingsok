import { BodyLong, Heading, HGrid, List } from "@navikt/ds-react";
import React from "react";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import studentsImg from "@images/students.jpg";
import parisImg from "@images/paris.jpg";
import writingImg from "@images/writing.jpg";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";
import { ListItem } from "@navikt/ds-react/List";

type Props = {
    readonly meta: PageInfo;
};

export default function SlikSkriverDuEnGodCv({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Med nokre enkle grep kan du auke sjansane dine for å bli kalla inn til intervju. Her får du tipsa
                    som gjer at CV-en din blir lagt merke til.
                </BodyLong>

                <ArticleBleedImage src={writingImg} alt="Ein konsentrert person som skriv på datamaskina si" />

                <Heading size="large" level="2" spacing>
                    CV og søknad
                </Heading>
                <BodyLong className="mb-12">
                    Arbeidsgjevarar krev ofte både CV og søknad når du søkjer på ein jobb. Start med CV-en fyrst, då er
                    det lettare å skrive søknaden.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Tilpass CV-en
                </Heading>
                <BodyLong spacing>
                    Finn ut kva informasjon som er viktig for arbeidsgjevaren. Tilpass CV-en etter jobben du søkjer på,
                    avhengig av kor mykje arbeidserfaring og utdanning du har.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Personlege opplysningar
                </Heading>
                <BodyLong spacing>
                    Start med å skrive inn opplysningar som namn, fødselsdato, e-post, telefonnummer og adresse.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Utdanning
                </Heading>
                <BodyLong spacing>
                    Legg inn den utdanninga du tok sist. Fag eller namn på utdanninga må vera med. Oppgi lærestad og når
                    utdanninga starta og slutta.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Fagbrev/svennebrev, mesterbrev og autorisasjon
                </Heading>
                <BodyLong spacing>
                    Har du teke yrkesfagleg utdanning og har fagbrev eller svennebrev, bør du leggja det inn i CV-en.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Arbeidserfaring
                </Heading>
                <BodyLong spacing>
                    Start med den siste jobben. Før opp stillingstittel og perioden du jobba der. Du kan også oppgi
                    arbeidsoppgåver og ansvarsområde i stikkordform.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Anna erfaring
                </Heading>
                <BodyLong spacing>
                    Har du erfaring frå til dømes tillitsverv eller frivillig arbeid, bør du inkludere det. Verv frå
                    skule, idrett, bustadlag eller liknande viser at du er villig til å ta ansvar, er sosial og
                    engasjert.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Førarkort
                </Heading>
                <BodyLong spacing>
                    Om du har førarkortet, kan det vera fint å få med det. Og sjølvsagt nødvendig viss stillinga krev
                    førarkort.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Kurs
                </Heading>
                <BodyLong spacing>
                    Før opp dei kursa som er relevante for stillinga du søkjer. Har du teke eit rekneskapskurs, er det
                    relevant for økonomistillingar. Førstehjelpskurs kan vera relevant for enkelte jobbar.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Sertifiseringar og sertifikat
                </Heading>
                <BodyLong spacing>
                    Har du éin eller fleire sertifiseringar, til dømes ADK-sertifisering, tek du det med i CV-en.
                    Truckførarbevis er eit anna døme.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Språk
                </Heading>
                <BodyLong spacing>
                    Før opp språk du meistrar, og på kva nivå munnleg og skriftleg. Hugs å ta med førstespråket ditt
                    (morsmål).
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Vitnemål og attestar
                </Heading>
                <BodyLong spacing>
                    Du kan skriva «Eg sender vitnemål og attestar ved førespurnad» i søknaden. Lever aldri frå deg
                    originale dokument. Du må sjølv sørgja for at kopiar og vitnemål er attesterte. Ein kopi med stempel
                    og underskrift viser at kopien er rett, viss arbeidsgivar krev det.
                </BodyLong>

                <Heading size="small" level="3" spacing>
                    Samandrag
                </Heading>
                <BodyLong spacing>
                    Bruk tid på å formulera eit godt samandrag (nøkkelkvalifikasjonar) som viser at erfaringa di passar
                    til akkurat denne stillinga. Om du søkjer på ei anna stilling seinare, må du spissa samandraget mot
                    den nye stillinga.
                </BodyLong>
                <BodyLong>
                    Søkjar du på ei stilling innanfor kontor og økonomi, kan eit samandrag til dømes innehalda:
                </BodyLong>
                <List>
                    <ListItem>3 års erfaring med saksbehandling og ansvar for eigen kundeportefølje.</ListItem>
                    <ListItem>
                        8 års erfaring som frivillig besøkskontakt for Røde Kors. Jobben har gjort meg omgjengeleg,
                        imøtekommande og serviceinnstilt.
                    </ListItem>
                    <ListItem>Årsstudium innanfor økonomi, i tillegg to kveldskurs i Excel.</ListItem>
                </List>
            </ArticleWrapper>

            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Vidare lesing
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkCard
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="secondary"
                    />
                    <ImageLinkCard
                        image={parisImg}
                        alt="Bilde av Eiffeltårnet"
                        title="Jobbe i utlandet"
                        description="Den Europeiske Jobbmobilitetsportslen (EURES) er et tilbud til deg som ønsker å finne en jobb i EU-/EØS-området og Sveits."
                        href="/jobbe-i-utlandet"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
