import { BodyLong, Heading, HGrid, Label } from "@navikt/ds-react";
import { List, ListItem } from "@navikt/ds-react/List";
import React from "react";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import bedriftImg from "@images/bedrift.jpg";
import { PageBlock } from "@navikt/ds-react/Page";
import annonseImg from "@images/stillingsannonse.jpg";

type Props = {
    readonly meta: PageInfo;
};
export default function HuskAGiTilbakemeldingTilJobbsoker({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>
                <BodyLong spacing>
                    Mange unge legger mye tid, motivasjon og håp i en jobbsøknad. Når de ikke får svar, oppleves det som
                    å bli &quot;ghostet&quot; – en total stillhet som skaper usikkerhet og gjør det vanskelig å forstå
                    hva som egentlig skjer i prosessen. For en førstegangssøker kan dette gå ut over selvtilliten og
                    opplevelsen av arbeidslivet som helhet.
                </BodyLong>

                <BodyLong spacing>
                    Ofte handler manglende tilbakemelding om tidspress eller travle perioder – men for jobbsøkeren er
                    det forskjellen mellom å føle seg sett eller ignorert.
                </BodyLong>

                <ArticleBleedImage
                    src="/images/ghostet.png"
                    alt="En mann som sitter ved et bord og ser tomt inn i mobilen sin"
                />
                <Heading size="large" level="2" spacing id="hvorfor-er-tilbakemeldinger-viktig-title">
                    Hvorfor er tilbakemeldinger viktige?
                </Heading>
                <List className="mb-6" aria-labelledby="hvorfor-er-tilbakemeldinger-viktig-title">
                    <ListItem>Det viser respekt for tiden jobbsøkeren har brukt.</ListItem>
                    <ListItem>Det bygger et positivt inntrykk av virksomheten deres.</ListItem>
                    <ListItem>Det gjør det mer sannsynlig at søkere prøver igjen – også når de får avslag.</ListItem>
                    <ListItem>God kommunikasjon gir dere et fortrinn i konkurransen om unge talenter.</ListItem>
                </List>

                <Heading size="large" level="2" spacing id="hva-kan-dere-gjore-title">
                    Hva kan dere gjøre enkelt og effektivt?
                </Heading>
                <List className="mb-6" aria-labelledby="hva-kan-dere-gjore-title">
                    <ListItem>
                        <Label as="span">Send et autosvar</Label> når søknaden er mottatt.
                    </ListItem>
                    <ListItem>
                        <Label as="span">Informer om tidslinjen:</Label> Når kan søkeren forvente svar?
                    </ListItem>
                    <ListItem>
                        <Label as="span">Gi et kort avslag</Label> – selv én setning er bedre enn stillhet.
                    </ListItem>
                    <ListItem>
                        <Label as="span">Hold jobbsøkere oppdatert</Label> hvis prosessen tar lengre tid enn planlagt.
                    </ListItem>
                    <ListItem>
                        <Label as="span">Husk at god kandidatbehandling er employer branding</Label> – hver eneste søker
                        er en ambassadør.
                    </ListItem>
                </List>

                <BodyLong className="mb-12">
                    God oppfølging trenger ikke ta mye tid, men den betyr enormt mye for den som søker sin første (eller
                    neste) jobb.
                </BodyLong>
            </ArticleWrapper>

            <PageBlock as="section" gutters width="lg" aria-labelledby="related-articles-heading">
                <Heading size="large" level="2" id="related-articles-heading" spacing>
                    Videre lesning
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkCard
                        image={bedriftImg}
                        alt="En mann sitter på et kontor og tar en annen i hånden"
                        title="Superrask Søknad"
                        description="En enklere måte å komme i kontakt med relevante jobbsøkere."
                        href="/superrask-soknad-bedrift"
                        color="secondary"
                    />
                    <ImageLinkCard
                        image={annonseImg}
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når du skriver annonsen?"
                        href="/skikkelig-bra-stillingsannonse"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
