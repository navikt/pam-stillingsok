import { BodyLong, Heading } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import { List, ListItem } from "@navikt/ds-react/List";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import Image from "next/image";
import studentsImg from "@images/students.jpg";
import jobbtreffImg from "@images/jobbtreff.jpg";
import ansattImg from "@images/ansatt.png";
import { PageInfo } from "@/app/(artikler)/pageInfoTypes";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

type Props = {
    readonly meta: PageInfo;
};
export default function NyttSokefelt({ meta }: Props) {
    return (
        <article lang={meta.language !== "nb" ? meta.language : undefined}>
            <div className="container-small mt-5 mb-12">
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Nå kan du kombinere fritekst og filtre for å finne akkurat jobben du er ute etter.
                </BodyLong>
            </div>

            <div className="container-medium mb-12">
                <Image
                    fill
                    quality={90}
                    className="article-image"
                    src={ansattImg}
                    alt="En glad person som står i en butikk."
                />
            </div>

            <div className="container-small mb-16">
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
                <LinkPanel className="arb-link-panel-primary" href="/stillinger">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Prøv det nye søket
                    </LinkPanelTitle>
                </LinkPanel>
            </div>

            <div className="container-medium mb-24">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <div className="image-link-panel-grid-medium">
                    <ImageLinkPanelMedium
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image={jobbtreffImg}
                        title="Enklere å finne jobber som kan passe"
                        alt="Bilde av person med laptop"
                        description="Vi bruker kunstig intelligens til å plassere annonsen i den kategorien som den (mest sannsynlig) hører hjemme i."
                        href="/nye-filtre"
                        color="tertiary"
                    />
                </div>
            </div>
        </article>
    );
}
