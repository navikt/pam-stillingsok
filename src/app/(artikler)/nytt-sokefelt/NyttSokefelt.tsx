import { BodyLong, Heading, HGrid, LinkCard } from "@navikt/ds-react";
import { List, ListItem } from "@navikt/ds-react/List";
import React from "react";
import ImageLinkCard from "@/app/_common/components/ImageLinkCard";
import studentsImg from "@images/students.jpg";
import jobbtreffImg from "@images/jobbtreff.jpg";
import ansattImg from "@images/ansatt.png";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";
import { LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

type Props = {
    readonly meta: PageInfo;
};
export default function NyttSokefelt({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Nå kan du kombinere fritekst og filtre for å finne akkurat jobben du er ute etter.
                </BodyLong>

                <ArticleBleedImage src={ansattImg} alt="En glad person som står i en butikk." />

                <BodyLong spacing>
                    Ved å legge til flere ord i søket ditt, vil du oppdage flere relevante stillinger og øke sjansen for
                    å lande drømmejobben.
                </BodyLong>
                <Heading size="small" level="2" spacing>
                    Måter å bruke det nye søket på:
                </Heading>
                <List aria-label="Måter å bruke det nye søket på:" className="mb-6">
                    <ListItem>
                        <strong>Utforskende søk</strong> – start bredt for å oppdage ulike muligheter
                    </ListItem>
                    <ListItem>
                        <strong>Spisset søk</strong> – når du har en klar idé om hva slags jobb du vil ha
                    </ListItem>
                    <ListItem>
                        <strong>Se på tvers av bransjer</strong> – søk på ferdigheter og interesser fremfor
                        tradisjonelle stillingstitler
                    </ListItem>
                    <ListItem>
                        <strong>Finn sesongarbeid</strong> – kombiner nøkkelord for sesongbaserte jobber
                    </ListItem>
                </List>

                <BodyLong>
                    <AkselNextLink href="/slik-bruker-du-det-nye-soket" className="mb-12">
                        Les mer om hvordan du kan bruke søket for best resultat
                    </AkselNextLink>
                </BodyLong>

                <LinkCard className="arb-link-panel-primary">
                    <LinkCardTitle>
                        <AkselNextLinkCardAnchor href="/stillinger">Prøv det nye søket</AkselNextLinkCardAnchor>
                    </LinkCardTitle>
                </LinkCard>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Videre lesning
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
                        image={jobbtreffImg}
                        title="Enklere å finne jobber som kan passe"
                        alt="Bilde av person med laptop"
                        description="Vi bruker kunstig intelligens til å plassere annonsen i den kategorien som den (mest sannsynlig) hører hjemme i."
                        href="/nye-filtre"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
