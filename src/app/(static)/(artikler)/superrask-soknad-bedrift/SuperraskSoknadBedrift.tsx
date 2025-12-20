import { BodyLong, Heading, HGrid, List } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import React from "react";
import ImageLinkPanelMedium from "@/app/_common/components/ImageLinkPanelMedium";
import annonseImg from "@images/stillingsannonse.jpg";
import dogMediumImg from "@images/dog-medium.png";
import bedriftImg from "@images/bedrift.jpg";
import { PageInfo } from "@/app/(static)/(artikler)/pageInfoTypes";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import { ListItem } from "@navikt/ds-react/List";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import { PageBlock } from "@navikt/ds-react/Page";

type Props = {
    readonly meta: PageInfo;
};

export default function SuperraskSoknadBedrift({ meta }: Props) {
    return (
        <>
            <ArticleWrapper lang={meta.language}>
                <Heading size="xlarge" level="1" spacing>
                    {meta.title}
                </Heading>

                <BodyLong size="large" spacing>
                    Superrask søknad er ei teneste på arbeidsplassen.no som vil gjere rekrutteringa enklare for
                    bedrifter og for dei som er på jakt etter ny jobb.
                </BodyLong>

                <ArticleBleedImage src={bedriftImg} alt="To personar som handhelsar" />

                <BodyLong spacing>
                    Produktleiar for arbeidsplassen.no, Marianne Garmann Ullsand, er veldig fornøgde med at superrask
                    søknad er så godt motteken. – Vi ser at mange bedrifter og jobbsøkjarar har teke i bruk superrask
                    søknad på arbeidsplassen.no. Bedrifter set pris på at ho er enkel å opprette og at ho bidreg til at
                    dei får større og raskare respons på dei ledige stillingane sine. Jobbsøkjarane liker at dei enklare
                    og raskare kan vise at dei er interesserte i jobben utan CV og skrive lang søknad.
                </BodyLong>
                <Heading size="medium" level="2" spacing>
                    Ny og forbetra versjon
                </Heading>
                <BodyLong className="mb-12">
                    Arbeidsgivere har sakna å kunne setje fleire statusar på kandidaten under rekrutteringsprosessen.
                    Dette, og dessutan fleire andre forbetringar og forenklingar, er no tilgjengeleg i den oppdaterte
                    versjonen av superrask søknad seier ho.
                </BodyLong>

                <Heading size="large" level="2" spacing>
                    Dette er superrask søknad
                </Heading>

                <Heading size="medium" level="3" spacing>
                    Vel superrask søknad i annonsen
                </Heading>
                <List className="mb-8">
                    <ListItem>
                        Vel superrask søknad når de registrerer eller endrar ein stillingsannonse på arbeidsplassen.no.
                        Spesifiser kva kvalifikasjonar de har behov for, få med må-krav om de har det.
                    </ListItem>
                    <ListItem>
                        Jobbsøkjarane svarer på kva kvalifikasjonar dei meiner dei oppfyller, og grunngir kort kvifor
                        dei er rett person for jobben.
                    </ListItem>
                </List>

                <Heading size="medium" level="3" spacing>
                    Få og vurder søknadene
                </Heading>
                <List className="mb-8">
                    <ListItem>
                        De finn søknadene under Stillingsannonser og Vis søknader på den aktuelle stillinga. Namna på
                        søkjarane blir ikkje i utgangspunktet viste, då det er frivilling å leggje inn namn. De kan
                        velje å vise namn.
                    </ListItem>
                    <ListItem>De ser raskt om ein søkjar er aktuell, og vel om de vil ta kontakt eller ikkje.</ListItem>
                    <ListItem>
                        Om de synest at søkjaren er aktuell, kan de velje å få tilgang til kontaktinformasjonen.
                        Jobbsøkjaren får e-post om at de er interesserte og sannsynlegvis kjem til å ta kontakt.
                    </ListItem>
                    <ListItem>De kan endre status på kandidaten undervegs i prosessen.</ListItem>
                    <ListItem>
                        Ønskjer de ikkje å gå vidare med kandidaten, kan de enkelt gi beskjed om dette. Søknaden vil då
                        slettast frå lista og jobbsøkjaren får automatisk eit vennleg avslag på e-posten sin med
                        arbeidsplassen.no som sender.
                    </ListItem>
                </List>

                <Heading size="medium" level="3" spacing>
                    Ta kontakt med jobbsøkjarar
                </Heading>
                <List className="mb-8">
                    <ListItem>
                        Korleis ønskjer de å gå vidare med aktuelle jobbsøkjarar? Kanskje ønskjer de eit telefonintervju
                        eller ein kaffiprat? De får ikkje tilsendt CV gjennom superrask søknad, så det avtaler dykk
                        eventuelt i etterkant.
                    </ListItem>
                </List>

                <Heading size="medium" level="3" spacing>
                    Fekk du tilsett?
                </Heading>
                <List className="mb-8">
                    <ListItem>
                        Då markerer du stillinga som besett og annonsen blir avpublisert på arbeidsplassen.no. Vi sender
                        melding til alle kandidatar som ikkje har status «tilsett».
                    </ListItem>
                </List>

                <BodyLong spacing>
                    Opplysningane som jobbsøkjaren har gitt, blir automatisk sletta 3 månader etter at fristen i
                    stillingsannonsen har gått ut.
                </BodyLong>
                <BodyLong className="mb-12">
                    Lykke til med å finne deira neste medarbeidar med superrask søknad!
                </BodyLong>

                <LinkPanel className="arb-link-panel-primary" href="/stillingsregistrering/stillingsannonser">
                    <LinkPanelTitle className="navds-link-panel__title navds-heading--small">
                        Lag ny stillingsannonse
                    </LinkPanelTitle>
                </LinkPanel>
            </ArticleWrapper>
            <PageBlock as="section" gutters width="lg">
                <Heading size="large" level="2" spacing>
                    Vidare lesning
                </Heading>
                <HGrid gap="space-24" columns={{ sm: 1, md: 2 }}>
                    <ImageLinkPanelMedium
                        image={annonseImg}
                        alt="Person som skriver på en skrivemaskin"
                        title="Skikkelig bra stillingsannonse"
                        description="Hva ser jobbsøkere etter når de leser en stillingsannonse? Hva bør du tenke på når
                                    du skriver annonsen?"
                        href="/skikkelig-bra-stillingsannonse"
                        color="secondary"
                    />
                    <ImageLinkPanelMedium
                        href="/enklere-a-skrive-gode-kvalifikasjoner"
                        image={dogMediumImg}
                        alt="Glad hund som som sitter ved kjøkkenbordet og ser på en person som fyller ut superrask søknad."
                        title="Nå er det enklere å skrive gode kvalifikasjonskrav"
                        description="Med superrask søknad kan du nå få forslag til kvalifikasjoner ved hjelp av kunstig intelligens."
                        color="tertiary"
                    />
                </HGrid>
            </PageBlock>
        </>
    );
}
