import { BodyLong, Heading, HGrid } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import bedriftImg from "@images/bedrift.jpg";
import annonseImg from "@images/stillingsannonse.jpg";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";

type Props = {
    readonly meta: PageInfo;
};

export default function ThonHotelSuperrask({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <ArticleBleedImage
                    className="article-image-pos-thon"
                    src="/images/ThonHotelDirektor.jpg"
                    alt="Bilde av direktør ved Thon Partner Hotel Otta Ruth Øien Mæhlum"
                    figcaption="Bildetekst: Ruth Øien Mæhlum, direktør ved Thon Partner Hotel Otta, er fornøyd med superrask søknad
                    på arbeidsplassen.no"
                />

                <BodyLong spacing>
                    Thon Partner Hotel Otta planlegger alltid sommersesongen i god tid og legger tidlig ut sommerjobbene
                    på arbeidsplassen.no. I år brukte de også superrask søknad, Nav sin nye søknadstjeneste. Det ga gode
                    resultater.
                </BodyLong>
                <BodyLong spacing>
                    Hotellbransjen er godt i gang med å rekruttere til en sommersesong der det forventes et stort
                    innrykk av turister i hele landet.
                </BodyLong>
                <BodyLong spacing>
                    Ruth Øien Mæhlum er direktør ved Thon Partner Hotel Otta og forteller at de er helt avhengig å få på
                    plass sommervikarer så tidlig som mulig. Hvert år lyser hun derfor ut sommerjobber på
                    arbeidsplassen.no, som har{" "}
                    <AkselNextLink href="/stillinger">
                        en av Norges største samlinger av ledige stillinger.
                    </AkselNextLink>
                </BodyLong>
                <BodyLong spacing>
                    – Vi starter alltid i god tid med å planlegge for sommeren og legger ut sommerjobbene i god tid.
                    Sommeren er høysesong og vi vet at vi trenger ekstra folk, sier hun.
                </BodyLong>
                <BodyLong className="mb-12">
                    I år valgte hun å legge til{" "}
                    <AkselNextLink href="/superrask-soknad-bedrift">superrask søknad</AkselNextLink> i
                    sommerjobb-annonsene. Superrask søknad er Nav sin nye tjeneste på arbeidsplassen.no som gjør det
                    enklere for bedrifter å få tak i folk.
                </BodyLong>

                <Heading size="medium" level="2" spacing>
                    Midt i blinken
                </Heading>
                <BodyLong spacing>
                    – Sommerjobb på hotell er jo egentlig midt i blinken for å bruke superrask søknad, sier Mæhlum.
                    Jobbene blir lett tilgjengelige for de som er på utkikk etter den type jobber og det er enkelt for
                    dem å søke.
                </BodyLong>
                <BodyLong spacing>
                    I superrask søknad trenger ikke jobbsøkerne å skrive en lang søknad eller sende CV for å søke på
                    jobbene. Hotelldirektøren forteller at det var uvant å ikke motta så mye informasjon fra søkerne,
                    men at det likevel var nok til å vurdere de til sommerjobbene de hadde lagt ut.
                </BodyLong>
                <BodyLong spacing>
                    – Jobbene krever lite formell kompetanse. Vår oppgave var derfor å tenke godt igjennom hvilke
                    kriterier vi la til grunn og at vi ikke hadde for mange. I annonsen for resepsjonist la vi inn kun
                    gode norskferdigheter og at de må være over 20 år. I tillegg gjelder det for alle våre stillinger at
                    de må være serviceinnstilte og motiverte, sier hun.
                </BodyLong>
                <BodyLong spacing>
                    Mæhlum forteller videre at det er hun som legger inn sommerjobbene på arbeidsplassen.no, og at hun
                    delegerer oppfølgingen av annonsene til sine avdelingsledere. – Det er fort gjort og lett å koble på
                    de som skal være ansvarlig for å ta kontakt med søkerne og gjøre intervjuene. Alt er på en plass og
                    alle har tilgang til samme informasjon, sier hun.
                </BodyLong>

                <ArticleBleedImage
                    src="/images/ThonHotel.jpg"
                    alt="Bilde av Jannicke, Lillian og Hans Morten"
                    className="article-image-pos-thon2"
                    figcaption="Bildetekst: Jannicke, Lillian og Hans Morten forbereder seg på mange turister i sommer."
                />

                <Heading size="medium" level="2" spacing>
                    Ansatte to søkere
                </Heading>
                <BodyLong spacing>
                    – Vi fikk mange søkere på sommerjobbene vi la ut og flere hadde brukt superrask søknad. To av disse
                    har vi nå skrevet arbeidsavtale med. Det var ikke alle som var aktuelle for å jobbe hos oss og da er
                    det jo genialt at vi kan gi de raskt beskjed om dette gjennom løsningen til arbeidsplassen.no, sier
                    Mæhlum.
                </BodyLong>
                <BodyLong spacing>
                    Hun legger også til at hotellet innimellom får besøk av folk som leverer papirene sine i resepsjonen
                    og at hun også har ansatt tre ukrainere som kom via Nav sitt introduksjonsprogram.
                </BodyLong>
                <BodyLong className="mb-12">
                    Hotelldirektøren anbefaler andre bedrifter til å bruke superrask søknad når de skal lyse ut både
                    sommer jobber og faste stillinger. – Det er ikke noe å lure på. Bruk superrask søknad til å få
                    kontakt med søkere. Det fungerte veldig bra for oss, avslutter hun.
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillingsregistrering/stillingsannonser">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Lag ny stillingsannonse
                    </LinkPanelTitle>
                </LinkPanel>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelMedium
                        href="/superrask-soknad-bedrift"
                        image={bedriftImg}
                        alt="En mann sitter på et kontor og tar en annen i hånden"
                        title="Superrask søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        href="/skikkelig-bra-stillingsannonse"
                        image={annonseImg}
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                        du skriver annonsen?"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
