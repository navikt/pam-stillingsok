import { BodyLong, Heading, List, HGrid } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import studentsImg from "@images/students.jpg";
import parisImg from "@images/paris.jpg";
import jobbsokerImg from "@images/jobbsoker.jpg";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { ListItem } from "@navikt/ds-react/List";
import { PageBlock } from "@navikt/ds-react/Page";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";

type Props = {
    readonly meta: PageInfo;
};

export default function SuperraskSoknadPerson({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Ein enklare måte å kome i kontakt med verksemder
                </BodyLong>

                <ArticleBleedImage src={jobbsokerImg} alt="Ein person som skriv på mobilen sin." />

                <BodyLong spacing>
                    Vi har gjort det lettare for deg å søkje på jobbar og kome i kontakt med interessante verksemder.
                    Med nokre få tastetrykk på mobil, nettbrett eller laptop kan du raskt vise fram erfaringa di og at
                    du er rett person til jobben. Det er enkelt å sjå kva stillingar som har superrask søknad, då desse
                    er merkte med «superrask søknad» i stillingssøk på arbeidsplassen.no.
                </BodyLong>
                <BodyLong className="mb-12">
                    Når du vel å søkje med superrask søknad, er det lagt opp til at du får beskjed frå verksemda om du
                    er aktuell eller ikkje. Du får denne beskjeden på e-post, så det er viktig at du er nøyen når du
                    legg inn kontaktinformasjonen din.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Ingen CV eller langt søknadsbrev
                </Heading>
                <List className="mb-12">
                    <ListItem>
                        Du svarar berre på dei kvalifikasjonane verksemda legg vekt på i stillinga. Du har moglegheit
                        til å skrive ei kort grunngjeving for kvifor nettopp du passar til jobben.
                    </ListItem>
                </List>

                <Heading size="large" level="2" spacing>
                    Du får beskjed
                </Heading>
                <List className="mb-12">
                    <ListItem>
                        Vi har gjort det enkelt for verksemda å vurdere søknaden din, slik at du raskt skal få
                        tilbakemelding. Uansett om verksemda vurderer deg som aktuell eller ikkje, skal du få ei melding
                        på e-post, slik at du slepp å gå og lure.
                    </ListItem>
                </List>

                <Heading size="large" level="2" spacing>
                    Du har kontroll på dine data
                </Heading>
                <List className="mb-8">
                    <ListItem>
                        Du kan når som helst trekkje tilbake søknaden din og informasjonen du har oppgitt.
                    </ListItem>
                    <ListItem>
                        Vi slettar all innsend informasjon tre månader etter at fristen i stillingsannonsen har gått ut.
                    </ListItem>
                </List>

                <BodyLong spacing>
                    Les også{" "}
                    <AkselNextLink href="/personvern-superrask-soknad">
                        personvernerklæringa for superrask søknad
                    </AkselNextLink>
                    .
                </BodyLong>
                <BodyLong spacing>
                    Prøv superrask søknad på arbeidsplassen.no og gje oss gjerne ei tilbakemelding på korleis du synest
                    det fungerte.
                </BodyLong>
                <BodyLong className="mb-12">Lukke til med jobbsøkja!</BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillinger">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Vis ledige stillingar
                    </LinkPanelTitle>
                </LinkPanel>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Videre lesning
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelMedium
                        image={studentsImg}
                        alt="3 blide studenter som sitter med mobil og pc og snakker sammen utenfor skolen"
                        title="Tips til jobbsøknaden"
                        description="Les våre tips om hvordan skrive søknaden slik at en arbeidsgiver får lyst til å møte akkurat deg."
                        href="/tips-til-jobbsoknaden"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        image={parisImg}
                        title="Jobbe i utlandet"
                        alt="Bilde av Eiffeltårnet"
                        description="Den Europeiske Jobbmobilitetsportslen (EURES) er et tilbud til deg som ønsker å finne en jobb i EU-/EØS-området og Sveits."
                        href="/jobbe-i-utlandet"
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
