import bedriftImg from "@images/bedrift.jpg";
import annonseImg from "@images/stillingsannonse.jpg";
import supermarketImg from "@images/woman-portrait-supermarket.png";
import { BodyLong, Heading, HGrid, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { PageBlock } from "@navikt/ds-react/Page";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ContentSection from "@/app/_common/ContentSection/ContentSection";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import type { PageInfo } from "@/app/(artikler)/pageInfoTypes";

type Props = {
    readonly meta: PageInfo;
};

export default function SuperraskSoknadIServiceOgOppvekstyrker({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Stadig flere arbeidsgivere tar i bruk{" "}
                    <AkselNextLink inlineText href="/superrask-soknad-bedrift">
                        superrask søknad
                    </AkselNextLink>{" "}
                    når de lyser ut ledige stillinger på arbeidsplassen.no. Løsningen gjør det enklere for jobbsøkere å
                    melde interesse for en stilling, samtidig som arbeidsgivere får raskere kontakt med aktuelle
                    kandidater.
                </BodyLong>

                <ArticleBleedImage src={supermarketImg} alt="Butikkmedarbeider" />

                <BodyLong spacing>
                    Tallene viser at det er særlig innen noen yrker at superrask søknad har fått fotfeste. Flest
                    annonser med denne søknadsformen finner vi blant butikkmedarbeidere, barnehage- og SFO-assistenter,
                    samt selgere.
                </BodyLong>
                <BodyLong spacing>
                    Dette er yrker med stort behov for medarbeidere og mange ledige stillinger gjennom året. Superrask
                    søknad kan bidra til å senke terskelen for å søke, slik at flere kandidater melder sin interesse.
                    For jobbsøkere betyr det en enklere og raskere vei inn til en mulig arbeidsgiver.
                </BodyLong>
                <BodyLong className="mb-12">
                    – Erfaringene så langt tyder på at både arbeidsgivere og jobbsøkere ønsker en smidigere
                    søknadsprosess. Derfor forventer vi at stadig flere bedrifter vil ta i bruk superrask søknad i tiden
                    fremover, sier Marianne Garmann Ullsand som er produktleder for arbeidsplassen.no.
                </BodyLong>
            </ArticleWrapper>

            <ContentSection
                className="mb-12"
                heading="Dette er superrask søknad:"
                as="section"
                surface="peachSubtle"
                width="text"
                paddingBlock={{ xs: "space-32" }}
            >
                Jobbsøker
                <List className="mb-12">
                    <ListItem>
                        Oppgir kun kontaktinformasjon som e-post og telefonnummer. Navn er frivillig å legge inn.
                    </ListItem>
                    <ListItem>Kan velge å svare på noen spørsmål fra arbeidsgiver.</ListItem>
                    <ListItem>Slipper å skrive søknadsbrev og sende inn CV.</ListItem>
                    <ListItem>Får raskt svar fra arbeidsgiver på e-post.</ListItem>
                </List>
                Arbeidsgiver
                <List>
                    <ListItem>Kan legge til inntil fem screeningsspørsmål i annonsen.</ListItem>
                    <ListItem>Kan enkelt følge opp innkomne søknader.</ListItem>
                </List>
            </ContentSection>

            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Videre lesing
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkCard
                        href="/superrask-soknad-bedrift"
                        image={bedriftImg}
                        alt="To personer som håndhilser"
                        title="Superrask Søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        color="primary"
                    />
                    <ImageLinkCard
                        image={annonseImg}
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                        href="/skikkelig-bra-stillingsannonse"
                        color="secondary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
